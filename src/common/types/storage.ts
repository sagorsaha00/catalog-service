export interface FileData {
   filename: string
   filedata: ArrayBuffer
}
export interface FileStorage {
   
   upload(data: FileData): Promise<void>
   delete(filename: string): void
   getObjectUrl(filename: string): string
}
