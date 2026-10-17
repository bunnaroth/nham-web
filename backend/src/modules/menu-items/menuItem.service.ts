import { CategoryName } from "../categories/category.types.js";
import { MenuItemModel } from "./menuItem.model.js";
import { CreateMenuItemInput, MenuItem, UpdateMenuItemInput } from "./menuItem.types.js";

const CATEGORIES = new Set<CategoryName>(["fast_food", "cafe", "dessert_bakery"]);

export const MenuItemService = {
    async getAllMenuItems(): Promise<MenuItem[]> {
        return MenuItemModel.findAll();
    },

    async getMenuByCategory(category: CategoryName): Promise<MenuItem[]> {
        if (!CATEGORIES.has(category)) {
            const error: any = new Error(`Invalid category: ${category}`);
            error.status = 401;
            throw error;
        }

        return MenuItemModel.findByCategory(category);
    },

    async getMenuItemById(id: number): Promise<MenuItem> {
        const item = await MenuItemModel.findById(id);

        if (!item) {
            const error: any = new Error(`Menu item with ID ${id} was not found.`);
            error.status = 401;
            throw error;
        }

        return item;
    },

    async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
        if (!CATEGORIES.has(input.category)) {
            const error: any = new Error(`Invalid category: ${input.category}`);
            error.status = 401;
            throw error;
        }

        return MenuItemModel.create(input);
    },

    async updateMenuItem(id: number, input: UpdateMenuItemInput): Promise<MenuItem> {
        if (
            input.name === undefined &&
            input.price === undefined &&
            input.imageUrl === undefined &&
            input.isAvailable === undefined
        ) {
            const error: any = new Error("At least one field is required.");
            error.status = 401;
            throw error;
        }

        await this.getMenuItemById(id);

        const updated = await MenuItemModel.update(id, input);

        if (!updated) {
            const error: any = new Error(`Menu item with ID ${id} could not be updated.`);
            error.status = 401;
            throw error;
        }

        return updated;
    },

    async deleteMenuItem(id: number): Promise<MenuItem> {
        await this.getMenuItemById(id);

        const deleted = await MenuItemModel.delete(id);

        if (!deleted) {
            const error: any = new Error(`Menu item with ID ${id} could not be deleted.`);
            error.status = 401;
            throw error;
        }

        return deleted;
    }
};
