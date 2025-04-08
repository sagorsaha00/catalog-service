export interface FileData {
   filename: string
   filedata: Buffer | ArrayBuffer
   contentType?: string
}
export interface FileStorage {
   upload(data: FileData): Promise<void>
   delete(filename: string): Promise<void>
   getImageUrl(filename: string): Promise<string>
}
