import { CategoryService } from "./category-services";
import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";

import { Logger } from "winston";
import { asyncwrapper } from "../common/utils/wrapper";
import authenticate from "../common/midderware/authenticate";
import { canAccess } from "./canAccess";
import { ROLES } from "../common/constant";

const router = express.Router();
const logger = new Logger();
const categoryService = new CategoryService();
const cateGoryContoller = new CategoryController(categoryService, logger);

router.post(
  "/",
  authenticate,
  canAccess([ROLES.ADMIN]),
  categoryValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await cateGoryContoller.create(req, res, next)
  )
);

router.patch(
  "/:id",
  authenticate,
  canAccess([ROLES.ADMIN]),
  categoryValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await cateGoryContoller.update(req, res, next)
  )
);
router.get(
  "/:id",
  authenticate,
  canAccess([ROLES.ADMIN]),
  categoryValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await cateGoryContoller.getCategoriedId(req, res, next)
  )
);
router.get(
  "/",
  authenticate,
  canAccess([ROLES.ADMIN]),
  categoryValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await cateGoryContoller.getAllCategories(req, res, next)
  )
);
router.delete(
  "/:id",
  authenticate,
  canAccess([ROLES.ADMIN]),
  categoryValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await cateGoryContoller.distroyCategories(req, res, next)
  )
);
export default router;
