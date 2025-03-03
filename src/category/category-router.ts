import { CategoryService } from "./category-services";
import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";

import { Logger } from "winston";

const router = express.Router();
const logger = new Logger();
const categoryService = new CategoryService();
const cateGoryContoller = new CategoryController(categoryService, logger);

router.post(
  "/",
  categoryValidator,
  async (req: Request, res: Response, next: NextFunction) =>
    await cateGoryContoller.create(req, res, next)
);

export default router;
