import mongoose from 'mongoose'

export const ToppingSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      image: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      tenantId: {
         type: String,
         required: true,
      },
      isPublish: {
         type: Boolean,
         required: false,
         default: false,
      },
   },
   { timestamps: true },
)

const ToppingModel = mongoose.model('toppings', ToppingSchema)
export default ToppingModel
