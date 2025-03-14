import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { Filter, products } from './products-types'
import { Productservice } from './product-service'
import { FileStorage } from '../common/types/storage'
import config from 'config'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
import mongoose from 'mongoose'
import { AuthRequest } from '../common/types'
import { ROLES } from '../common/constant'
export class productController {
   constructor(
      private productservice: Productservice,
      private stroage: FileStorage,
   ) {}

   create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const result = validationResult(req)

         if (!config.get('s3.bucket')) {
            throw new Error('S3 Bucket name is missing! Check your config.')
         }

         if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
         }

         const {
            name,
            description,
            priceConfiguration,
            attributes,
            CategoryId,
            tenantId,
            isPublish,
         } = req.body

         const image = req.files!.image as UploadedFile
         // console.log('image', image)
         const imagename = uuidv4()
         const buffer = Buffer.from(image.data.buffer)

         await this.stroage.upload({
            filename: imagename,
            filedata: buffer.buffer as ArrayBuffer,
         })
         // ✅ Convert string to object only if needed
         const parsedPriceConfig =
            typeof priceConfiguration === 'string'
               ? JSON.parse(priceConfiguration)
               : priceConfiguration

         const parsedAttributes =
            typeof attributes === 'string' ? JSON.parse(attributes) : attributes

         const product = {
            name,
            description,
            priceConfiguration: parsedPriceConfig, // ✅ Now it's an object
            attributes: parsedAttributes,
            CategoryId,
            tenantId,
            image: imagename,
            isPublish,
         }

         const newProduct = await this.productservice.create(
            product as products,
         )

         return res.json({ id: newProduct._id })
      } catch (error) {
         console.error('Error error error ', error)
         return next(createHttpError(400, 'Invalid  error format'))
      }
   }

   update = async (request: Request, res: Response, next: NextFunction) => {
      try {
         const result = validationResult(request)
         if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
         }

         const productId = request.params.productId?.trim()
         console.log('productId', productId)

         if (!productId) {
            return next(createHttpError(400, 'Product ID is required'))
         }

         if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(createHttpError(400, 'Invalid Product ID format'))
         }

         const objectId2 = new mongoose.Types.ObjectId(productId)
         console.log('obejctId', objectId2)

         const fortennatproductId =
            await this.productservice.getProductId(productId)

         const tenantIdfromauth = (request as unknown as AuthRequest).auth
            .tenant

         if ((request as unknown as AuthRequest).auth.role !== ROLES.ADMIN) {
            if (fortennatproductId?.tenantId !== tenantIdfromauth) {
               const error = createHttpError(
                  403,
                  'your resurant id do not match',
               )
               next(error)
            }
         }

         let imagename: string | undefined
         let oldImage: string | undefined

         if (request.files?.image) {
            oldImage = (
               await this?.productservice.getProductImageId(objectId2)
            )?.toString()

            const image = request.files.image as UploadedFile
            imagename = uuidv4()

            const buffer = Buffer.from(image.data)

            await this.stroage.upload({
               filename: imagename,
               filedata: buffer.buffer as ArrayBuffer,
            })

            if (oldImage) {
               await this.stroage.delete(oldImage)
            } else {
               console.log('No old image to delete')
            }
         }

         const {
            name,
            description,
            priceConfiguration,
            attributes,
            CategoryId,
            tenantId,
            isPublish,
         } = request.body

         const parsedPriceConfig =
            typeof priceConfiguration === 'string'
               ? JSON.parse(priceConfiguration)
               : priceConfiguration

         const parsedAttributes =
            typeof attributes === 'string' ? JSON.parse(attributes) : attributes

         const product = {
            name,
            description,
            priceConfiguration: parsedPriceConfig,
            attributes: parsedAttributes,
            CategoryId,
            tenantId,
            image: imagename ? imagename : oldImage,
            isPublish,
         }

         await this.productservice.update(objectId2, product)

         res.json({ message: 'Product updated successfully', id: productId })
      } catch (error) {
         console.error('Error in update function:', error)
         next(createHttpError(500, 'Internal Server Error'))
      }
   }
   index = async (request: Request, res: Response, next: NextFunction) => {
      const { q, tenantId, CategoryId, isPublish } = request.query
      console.log('all data', tenantId, CategoryId, isPublish)
      console.log('q', q)
      const filters: Filter = {}
      if (isPublish == 'true') {
         filters.isPublish = true
      }

      if (tenantId) filters.tenantId = tenantId as string

      if (CategoryId && mongoose.Types.ObjectId.isValid(CategoryId as string)) {
         filters.CategoryId = new mongoose.Types.ObjectId(CategoryId as string)
      }

      const products = await this.productservice.getProducts(
         q as string,
         filters,
         {
            page: request.query.page
               ? parseInt(request.query.page as string)
               : 1,
            limit: request.query.limit
               ? parseInt(request.query.page as string)
               : 10,
         },
      )

      if (!products) {
         console.error('products is undefined or null')
         return []
      }

      const finalProducts = (products.Data as products[]).map(
         (product: products) => {
            return {
               ...product,
               image: this.stroage.getImageUrl(product.image),
            }
         },
      )

      res.json({
         totalDocs: finalProducts,
         docs: products.data,
         limit: products.limit,
         page: products.page,
      })
   }
   GetSingleProduct = async (
      request: Request,
      res: Response,
      next: NextFunction,
   ) => {
      try {
         const { productId } = request.params
         console.log('Received productId:', productId)

         if (!productId) {
            throw createHttpError(400, 'Product ID Not Found')
         }

         if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw createHttpError(400, 'Invalid Product ID format')
         }

         const product = await this.productservice.getSingleProduct(productId)
         console.log('product', product)
         if (!product) {
            throw createHttpError(404, 'Product not found')
         }

         res.json(product)
      } catch (error) {
         next(error)
      }
   }
   deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { productId } = req.params

         if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(createHttpError(400, 'Invalid Product ID format'))
         }

         const productImageId = await this.productservice.getProductImageId(
            productId as unknown as mongoose.Types.ObjectId,
         )
         console.log('productImageId', productImageId)
         if (!productImageId) {
            console.log(`No product found with ID: ${productId}`)
            return null
         }

         const imageUrl = productImageId.toString()
         if (!imageUrl) {
            console.warn(`No image found for product ${productId}`)
         } else {
            const imageKey = imageUrl.split('/').pop()
            console.log('imageky', imageKey)
            await this.stroage.delete(imageKey as string)
            console.log(`Deleted image from S3: ${imageKey}`)
         }

         await this.productservice.DeleteObject(productId)
         res.status(200).json({
            message: 'Product and image deleted successfully',
         })
      } catch (error) {
         console.error('Error deleting product:', error)
         next(createHttpError(500, 'Internal Server Error'))
      }
   }
}
