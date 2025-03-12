import mongoose from 'mongoose'
import ProductModel from './product-model'
import { Filter, products } from './products-types'

export class Productservice {
   async create(product: products) {
      const newproduct = await ProductModel.create(product)
      return newproduct
   }
   async getProductImageId(productId: mongoose.Types.ObjectId) {
      try {
         const productImageId = await ProductModel.findById(productId)

         if (!productImageId) {
            console.log(`No product found with ID: ${productId}`)
            return null
         }

         return productImageId.image
      } catch (error) {
         console.error('Error fetching product image ID:', error)
         return null
      }
   }

   async update(
      productId: mongoose.Types.ObjectId,
      product: Partial<products>,
   ) {
      try {
         const updateProduct = await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            { new: true },
         )

         if (!updateProduct) {
            console.log(`No product found with ID: ${productId}`)
            return null
         }

         return updateProduct
      } catch (error) {
         console.error('Error updating product:', error)
         return null
      }
   }
   async getProductId(productId: string): Promise<{ tenantId: string } | null> {
      return await ProductModel.findById(productId)
   }

   async getProducts(q: string, filters: Filter) {
      const searchQueryRegex = new RegExp(q, 'i')

      const matchQuery = {
         ...filters,
         name: searchQueryRegex,
      }

      const aggregate = ProductModel.aggregate([
         { $match: matchQuery },
         {
            $lookup: {
               from: 'categories',
               localField: 'CategoryId',
               foreignField: '_id',
               as: 'category',
               pipeline: [
                  {
                     $project: {
                        _id: 1,
                        name: 1,
                        priceConfiguration: 1,
                        attributes: 1,
                     },
                  },
               ],
            },
         },
         {
            $unwind:'$category'
         }
      ])

      const result = await aggregate.exec()

      return result as products[]
   }
}
