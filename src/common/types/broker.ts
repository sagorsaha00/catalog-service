export interface SendMessageProducer {
   connect: () => Promise<void>
   disconnect: () => Promise<void>
   sendMessage: (topic: string, message: string) => Promise<void>
}
