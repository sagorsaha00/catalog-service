import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { products } from './products-types'
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

         if (!productId) {
            return next(createHttpError(400, 'Product ID is required'))
         }

         if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(createHttpError(400, 'Invalid Product ID format'))
         }

         const objectId2 = new mongoose.Types.ObjectId(productId)

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
}
