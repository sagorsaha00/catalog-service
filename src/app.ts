import express, { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import productrouter from "./products/product-router"
import categoryrouter from "./category/category-router"
import topingrouter from "./toppings/topping-router"
import { globalErrorHandler } from "./common/midderware/globalErrorHanderl";
import multer from "multer";
import fileUpload from 'express-fileupload';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
app.use("/categories", categoryrouter as RequestHandler);
app.use("/products", productrouter);
app.use("/toppings",  topingrouter);
app.use(globalErrorHandler);
export default app;
 

