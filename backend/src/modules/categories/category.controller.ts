import { Request, Response, NextFunction } from "express";
import { CategoryName } from "./category.types.js";
import { CategoryService } from "./category.service.js";

const categoryNames: CategoryName[] = [ 
    "fast_food", 
    "cafe", 
    "dessert_bakery"
];

export const CategoryController = { 
    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const categories = await CategoryService.getAllCategories(); 

            res.status(200).json(categories);
        } catch (error) { 
            next(error); 
        }
    }, 

    async getCategoryByName(req: Request, res: Response, next: NextFunction) : Promise<void> { 
        try { 
            const { name } = req.params; 

            if (!categoryNames.includes(name as CategoryName)) { 
                res.status(400).json({message: "Invalid category name"});
                return;
            }

            const category = await CategoryService.getCategoryByName(name as CategoryName); 

            if (!category) { 
                res.status(400).json({ 
                    message: "Category not found."
                }); 
                return;
            }

            res.status(200).json(category);
        } catch (error) { 
            next(error);
        }
    }
};