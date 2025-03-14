import { toppingService } from './topping-service'
import { UploadedFile } from 'express-fileupload'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { FileStorage } from '../common/types/storage'
import { Toppings } from './topping-types'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
export class toppingController {
   constructor(
      private toppingService: toppingService,
      private storage: FileStorage,
   ) {}

   create = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const result = validationResult(req)

         if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
         }

         const { name, price, tenantId, isPublish } = req.body

         if (!name || !price || !tenantId || !isPublish) {
            return next(
               createHttpError(400, 'Missing required fields from you from'),
            )
         }
         const image = req.files!.image as UploadedFile

         const imagename = uuidv4()
         const buffer = Buffer.from(image.data.buffer)

         await this.storage.upload({
            filename: imagename,
            filedata: buffer.buffer as ArrayBuffer,
         })

         const topping = {
            name,
            price,
            tenantId,
            isPublish,
            image: imagename,
         }

         let newTopping
         try {
            newTopping = await this.toppingService.create(topping as Toppings)
         } catch (dbError) {
            console.error('Database Error:', dbError)
            return next(createHttpError(500, 'Failed to create topping'))
         }

         return res.json({ ['topping create']: newTopping._id })
      } catch (error) {
         console.error('Error:', error)
         return next(createHttpError(400, 'Invalid error format'))
      }
   }
   update = async (request: Request, res: Response, next: NextFunction) => {
      try {
         const result = validationResult(request)
         if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
         }

         const toppingId = request.params.toppingId?.trim()

         if (!toppingId) {
            return next(createHttpError(400, 'Product ID is required'))
         }

         if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            return next(createHttpError(400, 'Invalid Product ID format'))
         }

         const objectId2 = new mongoose.Types.ObjectId(toppingId)

         let imagename: string | undefined
         let oldImage: string | undefined

         if (request.files?.image) {
            oldImage = (
               await this.toppingService.gettoppingmageId(objectId2)
            )?.toString()

            const image = request.files.image as UploadedFile
            imagename = uuidv4()

            const buffer = Buffer.from(image.data)

            await this.storage.upload({
               filename: imagename,
               filedata: buffer.buffer as ArrayBuffer,
            })

            if (oldImage) {
               await this.storage.delete(oldImage)
            } else {
               console.log('No old image to delete')
            }
         }

         const { name, price, tenantId, isPublish } = request.body

         const updatetopping = {
            name,
            price,
            tenantId,
            image: imagename ? imagename : oldImage,
            isPublish,
         }

         await this.toppingService.update(objectId2, updatetopping)

         res.json({ message: 'Topping updated successfully', _id: toppingId })
      } catch (error) {
         console.error('Error in update function:', error)
         next(createHttpError(500, 'Internal Server Error'))
      }
   }
   deleteTopping = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { toppingId } = req.params

         if (!mongoose.Types.ObjectId.isValid(toppingId)) {
            return next(createHttpError(400, 'Invalid Product ID format'))
         }

         const toppingImageId = await this.toppingService.gettoppingmageId(
            toppingId as unknown as mongoose.Types.ObjectId,
         )
         console.log('productImageId', toppingImageId)
         if (!toppingImageId) {
            console.log(`No product found with ID: ${toppingId}`)
            return null
         }

         const imageUrl = toppingImageId.toString()
         if (!imageUrl) {
            console.warn(`No image found for product ${toppingId}`)
         } else {
            const imageKey = imageUrl.split('/').pop()
            console.log('imageky', imageKey)
            await this.storage.delete(imageKey as string)
            console.log(`Deleted image from S3: ${imageKey}`)
         }

         await this.toppingService.DeleteObject(toppingId)
         res.status(200).json({
            message: 'topping and image deleted successfully',
         })
      } catch (error) {
         console.error('Error deleting product:', error)
         next(createHttpError(500, 'Internal Server Error'))
      }
   }
   getSingleTopping = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ) => {
      try {
         const { toppingId } = req.params // Get ID from URL

         console.log('Fetching topping with ID:', toppingId)

         const topping = await this.toppingService.gettoppingId(toppingId)

         if (!topping) {
            return next(createHttpError(404, 'Topping not found'))
         }

         return res.json({ success: true, topping })
      } catch (error) {
         console.error('Error fetching topping:', error)
         return next(createHttpError(500, 'Internal Server Error'))
      }
   }
   getAllleTopping = async (
      req: Request,
      res: Response,
      next: NextFunction,
   ) => {
      try {
         const topping = await this.toppingService.gettoppingList()

         if (!topping) {
            return next(createHttpError(404, 'Topping not found'))
         }

         return res.json({ success: true, topping })
      } catch (error) {
         console.error('Error fetching topping:', error)
         return next(createHttpError(500, 'Internal Server Error'))
      }
   }
}
