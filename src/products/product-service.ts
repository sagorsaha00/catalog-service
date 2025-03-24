import mongoose from 'mongoose'
import ProductModel from './product-model'
import { Filter, products } from './products-types'
import { PaginateQurytypes } from '../common/types'
import { paginationLabels } from '../config/pagination'

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
      const getProductId = await ProductModel.findById(productId)
      console.log('getProductId', getProductId)
      return getProductId
   }

   async getProducts(q: string, filters: Filter, paginatequry: PaginateQurytypes) {
      const matchQuery: any = { ...filters };
   
      // Ensure search term does not break query
      if (q) {
         matchQuery.name = new RegExp(q, 'i');
      }
   
      // Ensure CategoryId is an ObjectId
      if (filters.CategoryId) {
         try {
            matchQuery.CategoryId = new mongoose.Types.ObjectId(filters.CategoryId);
         } catch (error) {
            console.error('Invalid CategoryId:', filters.CategoryId);
         }
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
                  { $project: { _id: 1, name: 1, priceConfiguration: 1, attributes: 1 } },
               ],
            },
         },
         { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }, // Avoid missing results
      ]);
   
      return ProductModel.aggregatePaginate(aggregate, {
         ...paginatequry,
         customLabels: paginationLabels,
      });
   }
   

   async getSingleProduct(productId: string) {
      const SingleproductId = await ProductModel.findById(productId)
      return SingleproductId
   }
   async DeleteObject(productId: string) {
      console.log('Received productId:', productId)
      const deleteProduct = await ProductModel.findByIdAndDelete(productId)
      console.log('deleteProduct:', deleteProduct)
      return deleteProduct
   }
}
