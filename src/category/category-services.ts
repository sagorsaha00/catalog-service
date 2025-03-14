import { Category } from "./catergory-types";
import CategoryModel from "./category-model";
import mongoose from "mongoose";

export class CategoryService {
  async create(categories: Category) {
    try {
      const newCategory = new CategoryModel(categories);

      const validationError = newCategory.validateSync();
      if (validationError) {
        console.error("Validation error:", validationError);
        throw new Error(`Validation failed: ${validationError.message}`);
      }

      const data = await newCategory.save();

      return data;
    } catch (error) {
      console.error("Error saving category:", error);
    }
  }

  async update(updateid: mongoose.Types.ObjectId, categories: Category) {
    try {
      if (!mongoose.Types.ObjectId.isValid(updateid)) {
        throw new Error(`Invalid ObjectId format: ${updateid}`);
      }

      const categoryExists = await CategoryModel.findById(updateid);
      if (!categoryExists) {
        throw new Error(`Category with ID ${updateid} not found`);
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        updateid,
        {
          name: categories.name,
          attributes: categories.attributes,
          priceConfiguration: categories.priceConfiguration,
        },
        { new: true }
      );

      if (!updatedCategory) {
        throw new Error("Failed to update category");
      }

       
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }
  async findByid(categoryId: mongoose.Types.ObjectId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error(`Invalid ObjectId format: ${categoryId}`);
      }

      const category = await CategoryModel.findById(categoryId);
      return category;
    } catch (error) {
      console.error("Error finding category:", error);
      throw error;
    }
  }
  async findAll() {
    try {
      return await CategoryModel.find({}); // ✅ Fetch all documents
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async deletCategoiresId(categoryId: mongoose.Types.ObjectId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error(`Invalid ObjectId format: ${categoryId}`);
      }

      const category = await CategoryModel.deleteOne(categoryId);
      return category;
    } catch (error) {
      console.error("Error finding category:", error);
      throw error;
    }
  }
}
