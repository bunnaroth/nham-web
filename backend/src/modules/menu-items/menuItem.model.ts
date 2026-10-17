import { pool } from "../../config/db.js";
import { CategoryName } from "../categories/category.types.js";
import { CreateMenuItemInput, MenuItem, UpdateMenuItemInput } from "./menuItem.types.js";

export const MenuItemModel = {
    async findAll(): Promise<MenuItem[]> {
        const query = `
            SELECT
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
            FROM menu_items
            ORDER BY category ASC, id DESC
        `;

        const result = await pool.query<MenuItem>(query);

        return result.rows;
    },

    async findById(id: number): Promise<MenuItem | null> {
        const query = `
            SELECT
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
            FROM menu_items
            WHERE id = $1
        `;

        const result = await pool.query<MenuItem>(query, [id]);

        return result.rows[0] || null;
    },

    async findByCategory(category: CategoryName): Promise<MenuItem[]> {
        const query = `
            SELECT
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
            FROM menu_items
            WHERE category = $1
            ORDER BY id DESC
        `;

        const result = await pool.query<MenuItem>(query, [category]);

        return result.rows;
    },

    async create(input: CreateMenuItemInput): Promise<MenuItem> {
        const query = `
            INSERT INTO menu_items (
                category,
                name,
                price,
                image_url
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
        `;

        const values = [
            input.category,
            input.name,
            input.price,
            input.imageUrl ?? null
        ];

        const result = await pool.query<MenuItem>(query, values);

        const menuItem = result.rows[0];
        if (!menuItem) {
            throw new Error("Failed to create menu item.");
        }

        return menuItem;
    },

    async update(id: number, input: UpdateMenuItemInput): Promise<MenuItem | null> {
        const fields: string[] = [];
        const values: (string | number | boolean | null)[] = [];
        let parameterIndex = 1;

        if (input.name !== undefined) {
            fields.push(`name = $${parameterIndex}`);
            values.push(input.name);
            parameterIndex++;
        }

        if (input.price !== undefined) {
            fields.push(`price = $${parameterIndex}`);
            values.push(input.price);
            parameterIndex++;
        }

        if (input.imageUrl !== undefined) {
            fields.push(`image_url = $${parameterIndex}`);
            values.push(input.imageUrl);
            parameterIndex++;
        }

        if (input.isAvailable !== undefined) {
            fields.push(`is_available = $${parameterIndex}`);
            values.push(input.isAvailable);
            parameterIndex++;
        }

        if (fields.length === 0) {
            const result = await pool.query<MenuItem>(
                `
                    SELECT
                        id,
                        category,
                        name,
                        price,
                        image_url AS "imageUrl",
                        is_available AS "isAvailable",
                        created_at AS "createdAt"
                    FROM menu_items
                    WHERE id = $1
                `,
                [id]
            );

            return result.rows[0] || null;
        }

        values.push(id);

        const query = `
            UPDATE menu_items
            SET ${fields.join(", ")}
            WHERE id = $${parameterIndex}
            RETURNING
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
        `;

        const result = await pool.query<MenuItem>(query, values);

        return result.rows[0] || null;
    },

    async delete(id: number): Promise<MenuItem | null> {
        const query = `
            DELETE FROM menu_items
            WHERE id = $1
            RETURNING
                id,
                category,
                name,
                price,
                image_url AS "imageUrl",
                is_available AS "isAvailable",
                created_at AS "createdAt"
        `;

        const result = await pool.query<MenuItem>(query, [id]);

        return result.rows[0] || null;
    }
};
