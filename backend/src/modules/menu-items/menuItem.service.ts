import { CategoryName } from "../categories/category.types.js";
import { MenuItemModel } from "./menuItem.model.js";
import { CreateMenuItemInput, MenuItem, UpdateMenuItemInput } from "./menuItem.types.js";
import {
    badRequest,
    validateNonEmptyString,
    validateObject,
    validatePositiveInteger,
} from "../../utils/validation.js";

const CATEGORIES = new Set<string>(["fast_food", "cafe", "dessert_bakery"]);

function validateCategory(category: unknown): asserts category is CategoryName {
    if (typeof category !== "string" || !CATEGORIES.has(category)) {
        badRequest(`Invalid category: ${String(category)}`);
    }
}

function validatePrice(price: unknown): asserts price is number {
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        badRequest("Price must be a non-negative finite number.");
    }
}

const validateImageUrl = (imageUrl: unknown): void => {
    if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== "string") {
        badRequest("Image URL must be a string or null.");
    }
};

export const MenuItemService = {
    async getAllMenuItems(): Promise<MenuItem[]> {
        return MenuItemModel.findAll();
    },

    async getMenuByCategory(category: CategoryName): Promise<MenuItem[]> {
        validateCategory(category);

        return MenuItemModel.findByCategory(category);
    },

    async getMenuItemById(id: number): Promise<MenuItem> {
        validatePositiveInteger(id, "Menu item ID");
        const item = await MenuItemModel.findById(id);

        if (!item) {
            const error = new Error(`Menu item with ID ${id} was not found.`);
            Object.assign(error, { status: 404 });
            throw error;
        }

        return item;
    },

    async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
        validateObject(input);
        validateCategory(input.category);
        validateNonEmptyString(input.name, "Name");
        validatePrice(input.price);
        validateImageUrl(input.imageUrl);

        return MenuItemModel.create(input);
    },

    async updateMenuItem(id: number, input: UpdateMenuItemInput): Promise<MenuItem> {
        validatePositiveInteger(id, "Menu item ID");
        validateObject(input);

        if (input.name !== undefined) {
            validateNonEmptyString(input.name, "Name");
        }
        if (input.price !== undefined) {
            validatePrice(input.price);
        }
        if (input.imageUrl !== undefined) {
            validateImageUrl(input.imageUrl);
        }
        if (input.isAvailable !== undefined && typeof input.isAvailable !== "boolean") {
            badRequest("Availability must be a boolean.");
        }

        if (
            input.name === undefined &&
            input.price === undefined &&
            input.imageUrl === undefined &&
            input.isAvailable === undefined
        ) {
            badRequest("At least one field is required.");
        }

        await this.getMenuItemById(id);

        const updated = await MenuItemModel.update(id, input);

        if (!updated) {
            const error = new Error(`Menu item with ID ${id} was not found.`);
            Object.assign(error, { status: 404 });
            throw error;
        }

        return updated;
    },

    async deleteMenuItem(id: number): Promise<MenuItem> {
        validatePositiveInteger(id, "Menu item ID");
        await this.getMenuItemById(id);

        const deleted = await MenuItemModel.delete(id);

        if (!deleted) {
            const error = new Error(`Menu item with ID ${id} was not found.`);
            Object.assign(error, { status: 404 });
            throw error;
        }

        return deleted;
    }
};
