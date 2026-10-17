import { CategoryName } from "../categories/category.types.js";

export interface MenuItem { 
    id: number; 
    category: CategoryName; 
    name:string; 
    price: number | string; 
    imageUrl: string | null; 
    isAvailable: boolean; 
    createdAt: Date;
}

export interface CreateMenuItemInput { 
    category: CategoryName; 
    name: string; 
    price: number; 
    imageUrl?: string | null;
}

export interface UpdateMenuItemInput { 
    name?: string; 
    price?: number;
    imageUrl?: string | null; 
    isAvailable?: boolean;
}