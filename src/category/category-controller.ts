import { NextFunction, Request, Response } from "express";
import { Category } from "./catergory-types";
import { CategoryService } from "./category-services";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";

export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private logger: Logger
  ) {}
  async create(request: Request, response: Response, next: NextFunction) {
    const result = validationResult(request);
    console.log("result", result);
    if (!result.isEmpty()) {
      next(createHttpError(400, result.array()[0].msg as string));
      return;
    }
    const { name, priceConfiguration, attributes } = request.body as Category;

    const categorycreatedata = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes,
    });
    // console.log('logger',this.logger.info('data save', {id: categorycreatedata.id} ));

    if (categorycreatedata) {
      response.json({ id: categorycreatedata.id });
    } else {
      // handle the case where categorycreatedata is undefined
      response.status(500).json({ error: "Failed to create category" });
    }
  }
}
