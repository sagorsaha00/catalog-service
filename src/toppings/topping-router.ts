import express from 'express'
import { toppingController } from './topping-controller'
import { toppingService } from './topping-service'
import { S3Stroage } from '../common/services/S3Strage'
import createToppingValidator from './create-topping-validator'
import updateToppingValidator from './update-topping-validator'
import authenticate from '../common/midderware/authenticate'
import { canAccess } from '../category/canAccess'
import { ROLES } from '../common/constant'
import fileUpload from 'express-fileupload'
import createHttpError from 'http-errors'

const router = express.Router()
const topingService = new toppingService()
const clientstorage = new S3Stroage()
const toppingCntroler = new toppingController(topingService, clientstorage)
router.post(
   '/',
   authenticate,
   // fileUpload({
   //    limits: { fileSize: 500 * 1024 },
   //    abortOnLimit: true,
   //    limitHandler: (req, res, next) => {
   //       const error = createHttpError(404, 'please give a pik uder 5 mb')
   //       next(error)
   //    },
   // }),
   canAccess([ROLES.MANAGER, ROLES.ADMIN]),
   createToppingValidator,
   toppingCntroler.create,
)
router.put(
   '/:toppingId',
   authenticate,
   // fileUpload({
   //    limits: { fileSize: 500 * 1024 },
   //    abortOnLimit: true,
   //    limitHandler: (req, res, next) => {
   //       const error = createHttpError(404, 'please give a pik uder 5 mb')
   //       next(error)
   //    },
   // }),
   canAccess([ROLES.MANAGER, ROLES.ADMIN]),
   updateToppingValidator,
   toppingCntroler.update,
)
router.delete(
   '/:toppingId',
   authenticate,
   canAccess([ROLES.MANAGER, ROLES.ADMIN]),
   toppingCntroler.deleteTopping,
)
router.get('/:toppingId', toppingCntroler.getSingleTopping)
router.get('/', toppingCntroler.getAllTopping)

export default router
