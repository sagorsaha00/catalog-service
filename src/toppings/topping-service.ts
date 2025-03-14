import mongoose from 'mongoose'
import { Toppings } from './topping-types'
import ToppingModel from './toppings-model'

export class toppingService {
   async create(topping: Toppings) {
      const newproduct = await ToppingModel.create(topping)
      return newproduct
   }
   async gettoppingmageId(toppingId: mongoose.Types.ObjectId) {
      try {
         const productImageId = await ToppingModel.findById(toppingId)

         if (!productImageId) {
            console.log(`No product found with ID: ${toppingId}`)
            return null
         }

         return productImageId.image
      } catch (error) {
         console.error('Error fetching product image ID:', error)
         return null
      }
   }
   async update(
      toppingId: mongoose.Types.ObjectId,
      topping: Partial<Toppings>,
   ) {
      try {
         const updateProduct = await ToppingModel.findOneAndUpdate(
            { _id: toppingId },
            { $set: topping },
            { new: true },
         )

         if (!updateProduct) {
            console.log(`No product found with ID: ${toppingId}`)
            return null
         }

         return updateProduct
      } catch (error) {
         console.error('Error updating product:', error)
         return null
      }
   }
   async DeleteObject(toppingId: string) {
      const deleteProduct = await ToppingModel.findByIdAndDelete(toppingId)
      console.log('deleteProduct:', deleteProduct)
      return deleteProduct
   }
   async gettoppingId(toppingId: string) {
      const getToppingId = await ToppingModel.findById(toppingId)

      return getToppingId
   }
   async gettoppingList() {
      const getToppingId = await ToppingModel.find()

      return getToppingId
   }
}
