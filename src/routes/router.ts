import { Application } from "express";
import images from "./images";
import auth from "./auth";
import { authMiddleware } from "../middleware/auth.middleware";
export default function router(app: Application): void {
  /**
   * Every source are specifed here
   */
  app.use("/auth", auth);
  app.use("/images", authMiddleware, images);
}
