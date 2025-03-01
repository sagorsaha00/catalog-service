import express, { Request, Response } from 'express'
import { globalErrorHandler } from './common/globalErrorHanderl'

const app = express()

app.get('/',(req:Request,res:Response) => {
    res.send("hello world")
})
app.use(globalErrorHandler)
export default app