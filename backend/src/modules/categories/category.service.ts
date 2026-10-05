import { CategoryModel } from "./category.model.js";
import { Category, CategoryName } from "./category.types.js";

export const CategoryService = { 
    async getAllCategories(): Promise<Category[]> { 
        return await CategoryModel.findAll(); 
    },

    async getCategoryByName(name: CategoryName): Promise<Category | null> { 
        return await CategoryModel.findByName(name);
    }
}; 
