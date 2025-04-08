import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import productrouter from './products/product-router'
import categoryrouter from './category/category-router'
import topingrouter from './toppings/topping-router'
import { globalErrorHandler } from './common/midderware/globalErrorHanderl'
import fileUpload from 'express-fileupload'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
   fileUpload({
      useTempFiles: false,
      tempFileDir: '/tmp/',
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
   }),
)
app.use(
   cors({
      origin: ['http://localhost:5173'],
      credentials: true,
   }),
)
app.use(
   cors({
      origin: ['http://localhost:3000'],
      credentials: true,
   }),
)

// ✅ Default Route
app.get('/', (req: Request, res: Response) => {
   res.send('Hello, world!')
})

// ✅ API Routes
app.use('/categories', categoryrouter)
app.use('/products', productrouter)
app.use('/toppings', topingrouter)

// ✅ Handle Unknown Routes (404 Not Found)
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(404).json({ error: 'Route not found' })
})

// ✅ Global Error Handler
app.use(globalErrorHandler)

export default app
