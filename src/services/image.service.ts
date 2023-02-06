import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { v4 } from "uuid";
import client from "../database/client";
import { HttpError } from "../types/custom.error";
import { Prisma } from "@prisma/client";

export interface FileMetadata {
  id: string;
  filePath: string;
  filename: string;
  originalName: string;
}

export type CreateImage = Omit<
  Prisma.ImagesCreateInput,
  "updateAt" | "id" | "createAt" | "user"
> & { userId: number };

class ImageService {
  private defaultPath = resolve("./resources");

  private validateMimeType(mimeType: string) {
    if (!mimeType.includes("image")) {
      throw new HttpError("File type is not supported", 400);
    }
  }
  private async saveFile(
    file: Express.Multer.File,
    dir: string,
    filePath: string
  ) {
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new HttpError("Error trying to save a file", 500);
    }
  }

  create(image: CreateImage) {
    const { userId, ...rest } = image;
    return client.images.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        updateAt: new Date(),
        ...rest,
      },
    });
  }

  findByFileName(originalName: string, userId: number) {
    return client.images.findFirst({
      where: {
        userId,
        originalName,
      },
    });
  }

  private createFileMetadata(file: Express.Multer.File, username: string) {
    const id = v4();
    const type = file.originalname.split(".")[1];
    return {
      id,
      filePath: `/${username}`,
      filename: `${id}.${type}`,
      originalName: file.originalname,
    };
  }

  async saveImage(file: Express.Multer.File, user: any) {
    this.validateMimeType(file.mimetype);
    const meta = this.createFileMetadata(file, user.id);

    const dir = this.defaultPath + meta.filePath;
    const filePath = meta.filePath + "/" + meta.filename;

    const exist = await this.findByFileName(meta.originalName, user.id);

    if (exist) {
      throw new HttpError("Image already exists", 400);
    }

    this.saveFile(file, dir, dir + "/" + meta.filename);

    const image = await this.create({
      filename: meta.filename,
      uuid: meta.id,
      path: filePath,
      originalName: meta.originalName,
      userId: user.id,
    });
    return {
      imageName: image.uuid,
      message: `Image was saved successfully`,
    };
  }

  async findImage(id: string, user: any) {
    const image = await client.images.findFirst({
      where: {
        uuid: id,
        userId: user.id,
      },
    });
    if (!image) {
      throw new HttpError("Image doesn't exist", 404);
    }
    return image;
  }
}

export default new ImageService();
