import { Router } from "express";
import imagesController from "../controllers/images.controller";
import multer from "multer";
import { dirname } from "path";
const upload = multer();
//Definition of every endpoint from source
export default Router()
  .get("/:id", (req, res) => imagesController.getImage(req, res))
  .post("/", upload.single("image"), (req, res) =>
    imagesController.uploadImage(req, res)
  );
