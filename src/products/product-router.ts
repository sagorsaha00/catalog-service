import express, { NextFunction, Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import productValidator from './create-product-validator'
import { productController } from './product-controller'
import authenticate from '../common/midderware/authenticate'
import { ROLES } from '../common/constant'
import { canAccess } from '../category/canAccess'
import { asyncwrapper } from '../common/utils/wrapper'
import { Productservice } from './product-service'
import {} from '../common/types/storage'
import { S3Stroage } from '../common/services/S3Strage'
import createHttpError from 'http-errors'
import updateProductValidator from './update-product-validator'

const router = express.Router()
const productservice = new Productservice()
const s3storage = new S3Stroage()

const ProductController = new productController(productservice, s3storage)

router.post(
   '/',
   authenticate,
   canAccess([ROLES.ADMIN, ROLES.MANAGER]),
   fileUpload({
      limits: { fileSize: 500 * 1024 },
      abortOnLimit: true,
      limitHandler: (req, res, next) => {
         const error = createHttpError(404, 'please give a pik uder 5 mb')
         next(error)
      },
   }),
   productValidator,
   ProductController.create,
)
router.put(
   '/:productId',
   authenticate,
   canAccess([ROLES.ADMIN, ROLES.MANAGER]),
   fileUpload({
      limits: { fileSize: 500 * 1024 },
      abortOnLimit: true,
      limitHandler: (req, res, next) => {
         const error = createHttpError(404, 'please give a pik uder 5 mb')
         next(error)
      },
   }),
   updateProductValidator,
   ProductController.update,
)
router.get('/',  ProductController.index)
router.get('/:productId',  ProductController.GetSingleProduct)
router.delete('/:productId',  ProductController.deleteProduct)

export default router
