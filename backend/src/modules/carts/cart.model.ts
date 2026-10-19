import { pool } from "../../config/db.js";
import { Cart, CartItem } from "./cart.types.js";

export const CartModel = { 
    async findLatestByUserId( 
        userId: number,
    ): Promise<Cart | null> { 
        const query = ` 
            SELECT  
                id, 
                user_id AS "userId"
            FROM carts 
            WHERE user_id = $1
            ORDER BY id DESC
            LIMIT 1
        `; 

        const result = await pool.query<Cart>(query, [userId]);

        return result.rows[0] ?? null;
    },  

    async  create(userId: number): Promise<Cart> { 
        const query = `
            INSERT INTO carts (user_id) 
            VALUES ($1)
            RETURNING 
                id
                user_id AS "userId"
        `;

        const result = await pool.query<Cart>(query, [userId]); 

        const cart = result.rows[0];

        if (!cart) { 
            throw new Error("Failed to create cart.");
        }

        return cart;
    },

    async findItemsByCartId(
        cartId: number,
    ): Promise<CartItem[]> {
        const query = `
            SELECT
                ci.id,
                ci.cart_id AS "cartId",
                ci.menu_item_id AS "menuItemId",
                mi.name,
                mi.image_url AS "imageUrl",
                ci.unit_price::text AS "unitPrice",
                ci.qty,
                (ci.unit_price * ci.qty)::text AS subtotal
            FROM cart_items AS ci
            INNER JOIN menu_items AS mi
                ON mi.id = ci.menu_item_id
            WHERE ci.cart_id = $1
            ORDER BY ci.id ASC
        `;

        const result = await pool.query<CartItem>(
            query,
            [cartId],
        );

        return result.rows;
    },

    async findAvailableMenuItem(menuItemId: number): Promise<{id: number; price: string} | null> { 
        const query = `
            SELECT
                id,
                price::text AS price
            FROM menu_items
            WHERE id = $1
              AND is_available = true
        `;

        const result = await pool.query<{
            id: number; 
            price: string;
        }>(query, [menuItemId]);

        return result.rows[0] ?? null;
    }, 

    async findItemByMenuItemId( 
        cartId: number, 
        menuItemId: number,
    ): Promise<{id: number; qty: number} | null> { 
        const query = `
            SELECT
                id, 
                qty 
            FROM cart_items 
            WHERE cart_id = $1
            AND menu_item_id = $2
            LIMIT 1
        `;

        const result = await pool.query<{
            id: number; 
            qty: number;
        }>(query, [cartId, menuItemId]); 

        return result.rows[0] ?? null; 
    }, 

    async insertItem(
        cartId: number,
        menuItemId: number,
        unitPrice: string,
        qty: number,
    ): Promise<void> {
        const query = `
            INSERT INTO cart_items (
                cart_id,
                menu_item_id,
                unit_price,
                qty
            )
            VALUES ($1, $2, $3, $4)
        `;

        await pool.query(query, [
            cartId,
            menuItemId,
            unitPrice,
            qty,
        ]);
    },

    async updateItemQuantity( 
        itemId: number, 
        qty: number
    ): Promise<void> { 
        const query = `
            UPDATE cart_items 
            SET qty = $2
            WHERE id = $1
        `;

        await pool.query(query, [itemId, qty]); 
    }, 

    async updateItemPrice(
        itemId: number, 
        unitPrice: string, 
    ): Promise<void> { 
        const query = `
            UPDATE cart_items 
            SET unit_price = $2
            WHERE id = $1
        `;

        await pool.query(query, [itemId, unitPrice]);
    }, 

    async deleteItem(
        cartId: number, 
        menuItemId: number, 
    ): Promise<boolean> { 
        const query = `
            DELETE FROM cart_items 
            WHERE cart_id = $1
            AND menu_item_id = $2
            RETURNING id
        `;

        const result = await pool.query(query, [
            cartId, 
            menuItemId,
        ]); 

        return (result.rowCount ?? 0) > 0;
    }, 

    async clearItems(cartId: number): Promise<void> { 
        const query = `
        DELETE FROM cart_items 
        WHERE cart_id = $1
        `;

        await pool.query(query, [cartId]); 
    },
};

