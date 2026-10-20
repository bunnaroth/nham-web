import { Request, Response, NextFunction } from "express";
import { MenuItemService } from "./menuItem.service.js";
import { CategoryName } from "../categories/category.types.js";
import { CreateMenuItemInput, UpdateMenuItemInput } from "./menuItem.types.js";

export const MenuItemController = { 
    async getAllMenuItems(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const menuItems = await MenuItemService.getAllMenuItems(); 

            res.status(200).json(menuItems);
        } catch (error) { 
            next(error);
        }
    }, 

    async getMenuByCategory(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const { category} = req.params; 

            const menuItems = await MenuItemService.getMenuByCategory(category as CategoryName); 

            res.status(200).json(menuItems); 
        } catch (error) { 
            next(error);
        }
    }, 

    async getMenuById(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const id = Number(req.params.id); 
            const menuItem = await MenuItemService.getMenuItemById(id); 

            res.status(200).json(menuItem); 
        } catch (error) { 
            next(error);
        }
    }, 

    async createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const input: CreateMenuItemInput = req.body; 

            const menuItem = await MenuItemService.createMenuItem(input); 

            res.status(201).json(menuItem); 
        } catch (error) { 
            next(error);
        }
    }, 

    async updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const id = Number(req.params.id); 
            const input: UpdateMenuItemInput = req.body; 

            const menuItem = await MenuItemService.updateMenuItem(id, input); 
            
            res.status(200).json(menuItem); 
        } catch (error) { 
            next(error);
        }
    }, 

    async deleteMenuItem( req: Request, res: Response, next: NextFunction): Promise<void> { 
        try { 
            const id = Number(req.params.id); 
            const menuItem = await MenuItemService.deleteMenuItem(id); 

            res.status(200).json({ 
                message: "Menu item deleted successfully.",
                menuItem
            }); 
        } catch (error) { 
            next(error);
        }
    }
};