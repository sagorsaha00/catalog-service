import config from 'config'
import {
   S3Client,
   PutObjectCommand,
   DeleteObjectCommand,
} from '@aws-sdk/client-s3'

import { FileData, FileStorage } from '../types/storage'
export class S3Stroage implements FileStorage {
   private client: S3Client
   private bucketName: string
   constructor() {
      this.bucketName = config.get('s3.bucket')

      if (!this.bucketName) {
         throw new Error('S3 Bucket name is missing! Check your config.')
      }
      this.client = new S3Client({
         region: config.get('s3.region'), // Make sure your region is correctly set
         credentials: {
            accessKeyId: config.get('s3.accesskey'),
            secretAccessKey: config.get('s3.secretkey'),
         },
      })
   }

   async getImageUrl(filename: string): Promise<string> {
    
      const bucket = config.get('s3.bucket')
      const region = config.get('s3.region')
      if (typeof bucket === 'string' && typeof region === 'string') {
         return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`
      }
      throw new Error('Method not implemented.')
   }
   
   async upload(data: FileData): Promise<void> {
     
      if (!data.filedata || data.filedata.byteLength === 0) {
        console.error('ফাইল ডাটা খালি!');
        throw new Error('ফাইল ডাটা খালি!');
      }
      
      console.log('আপলোড করার ফাইল সাইজ:', data.filedata.byteLength, 'bytes');
      
      const objectParams = {
        Bucket: config.get('s3.bucket'),
        Key: data.filename,
        Body: data.filedata,
        ContentType: data.contentType || 'image/jpeg',
      }
      
      //@ts-ignore
      return await this.client.send(new PutObjectCommand(objectParams))
    }

   async delete(filename: string): Promise<void> {
      const objectParams = {
         Bucket: config.get('s3.bucket') as string,
         Key: filename,
      }

      await this.client.send(new DeleteObjectCommand(objectParams))
   }
}
