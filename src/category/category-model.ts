import mongoose from "mongoose";
import { Attributes, Category, priceConfiguration } from "./catergory-types";

const priceConfigurationSchema = new mongoose.Schema<priceConfiguration>({
  priceType: {
    type: String,
    enum: ["base", "aditional"],
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});
const AttributesSchema = new mongoose.Schema<Attributes>({
  name: {
    type: String,
    required: true,
  },
  widgetType: {
    type: String,
    enum: ["switch", "radio"],
    required: true,
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});

export const CategorySchema = new mongoose.Schema<Category>({
   
  name: {
    type: String,
    required: true,
  },
  priceConfiguration: {
    type: Map,
    of: priceConfigurationSchema,
    required: true,
  },
  attributes: {
    type: [AttributesSchema],
    required: true,
  },
});
const CategoryModel = mongoose.model('Category', CategorySchema);
export default CategoryModel
