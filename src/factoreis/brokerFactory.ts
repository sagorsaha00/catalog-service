import { KafkaProducerBroker } from '../config/kafka'
import { SendMessageProducer } from './../common/types/broker'
import config from 'config'

let messageProvider: SendMessageProducer | null = null

export const createBrockerFactory = (): SendMessageProducer => {
   if (!messageProvider) {
      messageProvider = new KafkaProducerBroker('catalog-service', [
         config.get('kafka.broker'),
      ])
   }
   return messageProvider
}

