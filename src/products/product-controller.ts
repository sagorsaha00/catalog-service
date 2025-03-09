import { priceConfiguration } from './../category/catergory-types'
import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { products } from './products-types'
import { Productservice } from './product-service'
import { FileStorage } from '../common/types/storage'
import config from 'config'
import { v4 as uuidv4 } from 'uuid'
import { UploadedFile } from 'express-fileupload'
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
}
