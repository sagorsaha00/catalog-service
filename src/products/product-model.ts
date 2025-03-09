 
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
      optional:true,
      required: true, // ✅ Spelling fixed
    },
    description: {
      type: String,
      required: true, // ✅ Spelling fixed
    },
    image: {
      type: String,
      required: true, // ✅ Spelling fixed
    },
    priceConfiguration: {
      type: Map,
      of: PriceConfigurationSchema,
    },
    attributes: [AttributesValuesSchema],
    tenantId: {
      type: String,
      required: true, // ✅ Spelling fixed
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

const ProductModel = mongoose.model("products", ProductSchema);
export default ProductModel;
