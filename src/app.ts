import express, { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import productrouter from "./products/product-router"
import categoryrouter from "./category/category-router"
import { globalErrorHandler } from "./common/midderware/globalErrorHanderl";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
app.use("/categories", categoryrouter as RequestHandler);
app.use("/products", productrouter);
app.use(globalErrorHandler);
export default app;
