import config from 'config'
import app from './app'
import { initDb } from './config/db'
import logger from './logger'

import { SendMessageProducer } from './common/types/broker'
import { createBrockerFactory } from './factoreis/brokerFactory'
import { KafkaProducerBroker } from './config/kafka'

const startserver = async () => {
   const PORT = config.get('server.port') || 5502
   let messageProducerBroker: SendMessageProducer | null = null
   try {
      await initDb()
   
      //kafka connect
      messageProducerBroker = createBrockerFactory()
      await messageProducerBroker.connect()
      app.listen(PORT, () => {
         logger.info(`surver is runing ${PORT}`)
         logger.info('databse connect successfully')
      })
   } catch (err: unknown) {
      if (err instanceof Error) {
         if (messageProducerBroker) {
            messageProducerBroker.disconnect()
         }
         setTimeout(() => {
            process.exit(1)
         }, 1000)
      }
   }
}

void startserver()
