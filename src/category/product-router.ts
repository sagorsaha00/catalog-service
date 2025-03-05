import express, { NextFunction, Request, Response } from "express";

import { asyncwrapper } from "../common/utils/wrapper";
import authenticate from "../common/midderware/authenticate";
import { canAccess } from "./canAccess";
import { ROLES } from "../common/constant";
import productValidator from "./product-validator";
import { productController } from "./product-controller";

const router = express.Router();

const ProductController = new productController();

router.post(
  "/",
  authenticate,
  canAccess([ROLES.ADMIN, ROLES.MANAGER]),
  productValidator,
  asyncwrapper(
    async (req: Request, res: Response, next: NextFunction) =>
      await ProductController.create(req, res, next)
  )
);

export default router;
