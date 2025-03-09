import ProductModel from "./product-model";
import { products } from "./products-types";

export class Productservice {
  async create(product: products) {
    const newproduct = await ProductModel.create(product);
    return newproduct;
  }
}
