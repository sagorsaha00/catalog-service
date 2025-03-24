import { NextFunction, Request, Response } from 'express'
import { Category } from './catergory-types'
import { CategoryService } from './category-services'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { Logger } from 'winston'
import mongoose from 'mongoose'
import config from 'config'
export class CategoryController {
   constructor(
      private categoryService: CategoryService,
      private logger: Logger,
   ) {}
   async create(request: Request, response: Response, next: NextFunction) {
      try {
         const { name, priceConfiguration, attributes } = request.body;
   
         let parsedPriceConfig: any = priceConfiguration;
         let parsedAttributes: any = attributes;
   
         // If priceConfiguration or attributes are strings, parse them
         if (typeof priceConfiguration === 'string') {
            try {
               parsedPriceConfig = JSON.parse(priceConfiguration);
            } catch (error) {
               return next(createHttpError(400, 'Invalid JSON format in priceConfiguration.'));
            }
         }
   
         if (typeof attributes === 'string') {
            try {
               parsedAttributes = JSON.parse(attributes);
            } catch (error) {
               return next(createHttpError(400, 'Invalid JSON format in attributes.'));
            }
         }
   
         // Continue with the creation process (for example, save to DB)
         const categorycreatedata = await this.categoryService.create({
            name,
            priceConfiguration: parsedPriceConfig,
            attributes: parsedAttributes,
         });
   
         // Return response with the category ID
         if (categorycreatedata) {
            return response.json({ id: categorycreatedata?.id });
         } else {
            return response.status(500).json({ error: 'Failed to create category' });
         }
      } catch (error) {
         console.error('Error in creating category:', error);
         return next(createHttpError(500, 'An unexpected error occurred'));
      }
   }
   

   async update(request: Request, response: Response, next: NextFunction) {
      const result = validationResult(request)

      if (!result.isEmpty()) {
         next(createHttpError(400, result.array()[0].msg as string))
         return
      }

      const catagoriesId = request.params.id?.trim()

      const { name, priceConfiguration, attributes } = request.body as Category
      const objectId = new mongoose.Types.ObjectId(catagoriesId)
      await this.categoryService.update(objectId, {
         name,
         priceConfiguration,
         attributes,
      })

      // console.log('logger',this.logger.info('data save',));

      return response
         .status(200)
         .json({ message: 'update successfully', id: catagoriesId })
   }
   async getCategoriedId(req: Request, response: Response, next: NextFunction) {
      const result = validationResult(req)

      if (!result.isEmpty()) {
         return next(createHttpError(400, result.array()[0].msg as string))
      }

      const categoriesId = req.params.id?.trim() // ✅ Trim spaces

      if (
         !categoriesId ||
         typeof categoriesId !== 'string' ||
         categoriesId.length !== 24 ||
         !mongoose.Types.ObjectId.isValid(categoriesId)
      ) {
         return next(
            createHttpError(400, `Invalid category ID format: ${categoriesId}`),
         )
      }

      try {
         // ✅ Convert to ObjectId safely
         const objectId = new mongoose.Types.ObjectId(categoriesId)

         const category = await this.categoryService.findByid(objectId)

         if (!category) {
            return next(createHttpError(404, 'Category not found'))
         }

         return response.status(200).json({
            message: 'Fetched successfully',
            id: categoriesId,
            category,
         })
      } catch (error) {
         console.error('Error fetching category:', error)
         return next(createHttpError(500, 'Server error'))
      }
   }
   async getAllCategories(
      request: Request,
      response: Response,
      next: NextFunction,
   ) {
      try {
         const categories = await this.categoryService.findAll() // ✅ Fetch all categories

         return response.status(200).json({
            message: 'Fetched successfully',
            total: categories.length, // ✅ Count total categories
            categories,
         })
      } catch (error) {
         console.error('Error fetching categories:', error)
         return next(createHttpError(500, 'Server error'))
      }
   }
   async distroyCategories(
      request: Request,
      response: Response,
      next: NextFunction,
   ) {
      const result = validationResult(request)

      if (!result.isEmpty()) {
         next(createHttpError(400, result.array()[0].msg as string))
         return
      }

      const catagoriesId = request.params.id?.trim()

      const objectId = new mongoose.Types.ObjectId(catagoriesId)
      await this.categoryService.deletCategoiresId(objectId)

      // console.log('logger',this.logger.info('data save',));

      return response
         .status(200)
         .json({ message: 'delete successfully', id: catagoriesId })
   }
}
