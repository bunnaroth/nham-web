import { pool } from "../../config/db.js"; 
import { Category, CategoryName } from "./category.types.js";

export const CategoryModel = { 
    async findAll(): Promise<Category[]> { 
        const query = `
        SELECT name FROM categories ORDER BY name ASC`; 

        const result = await pool.query<Category>(query); 

        return result.rows;
    },

    async findByName(name: CategoryName): Promise<Category | null> { 
        const query = `
            SELECT name FROM categories WHERE name = $1
        `; 

        const result = await pool.query<Category>(query, [name]); 

        return result.rows[0] ?? null;
    }
}