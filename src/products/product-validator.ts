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
   body('image').custom((value, { req }) => {
      if (!req.files) throw new Error('image is required')
      return true
   }),
]

// export default  [
//    body('name')
//       .isString()
//       .notEmpty()
//       .withMessage('Product name is required'),

//    body('description')
//       .isString()
//       .notEmpty()
//       .withMessage('Description is required'),

//    body('priceConfiguration')
//    .notEmpty()
//       .withMessage('Price configuration must be an object'),

//    body('priceConfiguration.Size.priceType')
//    .notEmpty()
//       .isIn(['base'])
//       .withMessage('Size priceType must be "base"'),

//    body('priceConfiguration.Size.availableOptions')
//    .notEmpty()
//       .withMessage('Size availableOptions must be an object'),

//    body('priceConfiguration.Crust.priceType')
//       .isString()
//       .isIn(['aditional'])
//       .withMessage('Crust priceType must be "aditional"'),

//    body('priceConfiguration.Crust.availableOptions')
//    .notEmpty()
//       .withMessage('Crust availableOptions must be an object'),

//    body('attributes')
//       .isArray()
//       .withMessage('Attributes must be an array'),

//    body('CategoryId')
//       .isString()
//       .notEmpty()
//       .withMessage('CategoryId is required'),

//    body('tenantId')
//       .isString()
//       .notEmpty()
//       .withMessage('tenantId is required'),

//    body('image')
//       .isString()
//       .notEmpty()
//       .withMessage('Image URL is required'),

//    body('isPublish')
//       .isString()
//       .isIn(['true', 'false'])
//       .withMessage('isPublish must be "true" or "false"'),
// ];
