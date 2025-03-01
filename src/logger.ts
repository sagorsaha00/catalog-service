import winston from 'winston'


const logger = winston.createLogger({
   level: 'info',
   defaultMeta: {
      serviceName: 'catalog-service',
   },
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
   ),
   transports: [
      new winston.transports.File({
         level: 'info',
         dirname: 'logs',
         filename: 'combine.log',
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
         ),
          
      }),
      new winston.transports.File({
         level: 'error',
         dirname: 'logs',
         filename: 'error.log',
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
         ),
          
      }),
      new winston.transports.Console({
         level: 'info',

         
      }),
   ],
})

export default logger
