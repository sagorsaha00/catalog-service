import config from 'config'
import mongoose from 'mongoose'

export const initDb = async () => {
   try {
      const dbUrl: string = config.get('database.url')
 

      await mongoose.connect(dbUrl)
   //  await mongoose.connect('mongodb+srv://mrartimas24:mrartimas24@catalog-service.wuarc.mongodb.net/catalog_service?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true');



      console.log('MongoDB connected successfully!')
   } catch (error) {
      console.error('Error connecting to MongoDB:', error)
   }
}
