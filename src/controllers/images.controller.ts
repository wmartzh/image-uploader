import { Request, Response } from "express";
import { BaseController } from "../types/base.controller";
import imageService from "../services/image.service";
import { HttpError } from "../types/custom.error";
import { resolve } from "path";

class ImagesController extends BaseController {
  async getImage(req: Request & { user?: any }, res: Response) {
    try {
      const id = req.params.id;
      const defaultPath = resolve("./resources");
      if (!id) {
        throw new HttpError("Id is required", 400);
      }

      const image = await imageService.findImage(id, req.user);

      res.sendFile(defaultPath + image.path);
    } catch (error) {
      this.errorHandler(res, error);
    }
  }
  async uploadImage(req: Request & { user?: any }, res: Response) {
    try {
      if (!req.file) {
        throw new HttpError("File is required", 400);
      }
      this.responseHandler(
        res,
        await imageService.saveImage(req.file, req.user),
        201
      );
    } catch (error) {
      this.errorHandler(res, error);
    }
  }
}

export default new ImagesController();
