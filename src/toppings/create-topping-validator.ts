import { body } from 'express-validator'
export default [
   body('name')
      .exists()
      .withMessage('name is required')
      .isString()
      .withMessage('name shoud be string'),
   body('price').exists().withMessage('priceConfiguration is requried'),
   body('tenantId').exists().withMessage('tenantId shoud be requried'),
   body('image').custom((value, { req }) => {
      if (!req.files) throw new Error('image is required')
      return true
   }),
]
