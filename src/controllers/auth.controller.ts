import { Request, Response } from "express";
import { BaseController } from "../types/base.controller";
import { CreateUserModel, LoginUserModel } from "../models/auth.model";
import authService from "../services/auth.service";

class AuthController extends BaseController {
  async register(req: Request, res: Response) {
    try {
      const body = await CreateUserModel.validateAsync(req.body);

      this.responseHandler(res, await authService.register(body), 200);
    } catch (error) {
      this.errorHandler(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const body = await LoginUserModel.validateAsync(req.body);

      this.responseHandler(
        res,
        await authService.login(body.email, body.password),
        200
      );
    } catch (error) {
      this.errorHandler(res, error);
    }
  }
}

export default new AuthController();
