import config from 'config'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
 
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

   getObjectUrl(filename: string): string {
      throw new Error('Method not implemented.')
   }
   async upload(data: FileData): Promise<void> {
      const objectParams = {
         Bucket: config.get('s3.bucket'),
         Key: data.filename,
         Body: data.filedata,
        
      }

      console.log('object-params name', objectParams)
      //@ts-ignore
      await this.client.send(new PutObjectCommand(objectParams))
      console.log('all ok success')
   }

   delete(filename: string): void {}
}
