import express, { Request, Response } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";

const router = express.Router();
const cateGoryContoller = new CategoryController();

router.post("/", categoryValidator, cateGoryContoller.create);

export default router;
