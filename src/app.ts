import express, { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import categoryrouter from "./category/category-router";
import { globalErrorHandler } from "./common/midderware/globalErrorHanderl";
import productrouter from "./category/product-router"
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
app.use("/categories", categoryrouter as RequestHandler);
app.use("/products", productrouter);
app.use(globalErrorHandler);
export default app;
