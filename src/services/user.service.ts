import { Prisma } from "@prisma/client";
import client from "../database/client";
import * as bcrypt from "bcrypt";
export type CreateUser = Omit<
  Prisma.UserCreateInput,
  "id" | "createdAt" | "updateAt" | "Images"
>;
class UserService {
  private hashPassword(pass: string) {
    const salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(pass, salt);
  }
  comparePassword(hash: string, pass: string) {
    return bcrypt.compareSync(pass, hash);
  }
  async create(createUser: CreateUser) {
    const { password, ...rest } = createUser;
    return client.user.create({
      data: {
        password: this.hashPassword(password),
        updateAt: new Date(),
        ...rest,
      },
    });
  }

  async findUserByEmail(email: string) {
    return client.user.findFirst({
      where: {
        email,
      },
    });
  }

  async userExistByEmail(email: string) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(
        "◉ ▶ file: user.service.ts:41 ▶ UserService ▶ userExistByEmail ▶ error",
        error
      );
      return false;
    }
  }
}

export default new UserService();
