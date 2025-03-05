 
import mongoose  from "mongoose";

const AttributesValuesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  value: mongoose.Schema.Types.Mixed,
});

const PriceConfigurationSchema = new mongoose.Schema({
  priceType: {
    type: String,
    enum: ["base", "aditional"],
  },
  availableOptions: {
    type: Map,
    of: Number,
  },
});

export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      requried: true,
    },
    priceConfiguration: {
      type: Map,
      of: PriceConfigurationSchema,
    },
    attributes: [AttributesValuesSchema],
    tenantId: {
      type: String,
      requried: true,
    },
    CategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    isPublish: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);
const ProductModel = mongoose.model("Category", ProductSchema);
export default ProductModel;
