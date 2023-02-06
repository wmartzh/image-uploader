import { User } from "@prisma/client";
import { HttpError } from "../types/custom.error";
import userService, { CreateUser } from "./user.service";
import * as jwt from "jsonwebtoken";
class AuthService {
  private key = process.env.SECRET || "";

  private generateToken(email: string, id: number) {
    const payload = {
      id,
      email,
      lastLogin: new Date().toISOString(),
    };
    return jwt.sign(payload, this.key, {
      expiresIn: "1d",
    });
  }
  compareToken(token: string) {
    return jwt.verify(token, this.key);
  }

  async register(newUser: CreateUser) {
    const userExist = userService.userExistByEmail(newUser.email);
    if (!userExist) {
      throw new HttpError("User doesn't exist", 404);
    }

    const user = await userService.create(newUser);
    return {
      message: `${user.email} was created successfully`,
    };
  }

  async login(email: string, password: string) {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new HttpError("User does't exists", 400);
    }
    if (!userService.comparePassword(user.password, password)) {
      throw new HttpError("Password is not valid", 401);
    }

    const token = this.generateToken(user.email, user.id);
    return {
      username: user.username,
      token,
    };
  }
}

export default new AuthService();
