import mongoose, { AggregatePaginateModel } from 'mongoose'
import { products } from './products-types'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const AttributesValuesSchema = new mongoose.Schema({
   name: {
      type: String,
   },
   value: mongoose.Schema.Types.Mixed,
})

// const PriceConfigurationSchema = new mongoose.Schema({
//    configurationKey: {
//       priceType: {
//          type: String,
//          enum: ['base', 'aditional'],
//       },
//       availableOptions: {
//          type: Map,
//          of: Number,
//       },
//    },
// })

const OptionSchema = new mongoose.Schema(
   {
      priceType: {
         type: String,
         enum: ['base', 'additional'],
         required: true,
      },
      availableOptions: {
         type: Map,
         of: Number,
         required: true,
      },
   },
   { _id: false }, // Prevents auto-generating `_id` for each option
)

const PriceConfigurationSchema = new mongoose.Schema(
   {
      configurationKey: {
         type: Map,
         of: OptionSchema, // ✅ Supports dynamic keys like "Size" and "Crust"
         required: true, // ✅ Ensures configurationKey is always present
         default: {}, // ✅ Prevents missing field errors
      },
   },
   { timestamps: true },
)

export const ProductSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         optional: true,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      image: {
         type: String,
         required: true,
      },
      priceConfiguration: {
         type: Map,
         of: PriceConfigurationSchema,
      },
      attributes: [AttributesValuesSchema],
      tenantId: {
         type: String,
         required: true,
      },
      CategoryId: {
         type: mongoose.Types.ObjectId,
         ref: 'Category',
      },
      isPublish: {
         type: Boolean,
         required: false,
         default: false,
      },
   },
   { timestamps: true },
)

ProductSchema.plugin(aggregatePaginate)

const ProductModel = mongoose.model<products, AggregatePaginateModel<products>>(
   'products',
   ProductSchema,
)
export default ProductModel
