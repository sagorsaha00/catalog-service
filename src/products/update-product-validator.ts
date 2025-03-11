import { body } from 'express-validator'
export default [
   body('name')
      .exists()
      .withMessage('name is required')
      .isString()
      .withMessage('name shoud be string'),
   body('description').exists().withMessage('description is requried'),
   body('priceConfiguration')
      .exists()
      .withMessage('priceConfiguration is requried'),
   body('attributes').exists().withMessage('attrebuties shoud be requried'),
   body('CategoryId').exists().withMessage('CategoryId shoud be requried'),
   body('tenantId').exists().withMessage('tenantId shoud be requried'),
]
