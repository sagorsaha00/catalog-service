import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/globalErrorHanderl";
import categoryrouter from "./category/category-router";
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
app.use("/categories", categoryrouter);
app.use(globalErrorHandler);
export default app;
