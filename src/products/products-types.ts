import mongoose from 'mongoose'

export interface products {
   name: string
   description: string
   attributes: string
   image: string  
   priceConfiguration: string
   CategoryId: string
   tenantId: string
   isPublish: string
}
export interface Filter {
   tenantId?: string
   CategoryId?: mongoose.Types.ObjectId
   isPublish?: boolean
}
