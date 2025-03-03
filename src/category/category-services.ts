import { Category } from "./catergory-types";
import CategoryModel from "./category-model";

export class CategoryService {
  async create(categories: Category) {
    try {
      // Log the data being saved for debugging
      console.log("Attempting to save category:", categories);

      const newCategory = new CategoryModel(categories);

      // Use validateSync to check for validation errors before saving
      const validationError = newCategory.validateSync();
      if (validationError) {
        console.error("Validation error:", validationError);
        throw new Error(`Validation failed: ${validationError.message}`);
      }

      const data = await newCategory.save();
      console.log("Category saved successfully:", data);

      return data;
    } catch (error) {
      console.error("Error saving category:", error);
      // Throw a more detailed error message
    }
  }
}
