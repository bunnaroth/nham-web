import { pool } from "../../config/db.js";
import { CheckoutCartItem, Order, OrderItem } from "./order.types.js";

import type {  PoolClient } from "pg"; 

export const OrderModel = { 
    async findCartByUserId(
        userId: number, 
        client?: PoolClient
    ): Promise<{id: number} | null> { 
        const query = `
            SELECT id
            FROM carts 
            WHERE user_id = $1 
            ORDER BY id DESC 
            LIMIT 1
            ${client ? "FOR UPDATE" : ""}
        `; 

        const result = await (client ?? pool).query<{id: number}>(query, [userId]); 

        return result.rows[0] ?? null; 
    }, 

    async findCartItemsForCheckout(
        cartId: number,
        client?: PoolClient
    ): Promise<CheckoutCartItem[]> { 
        const query = `
            SELECT 
                mi.id AS "menuItemId", 
                mi.name, 
                mi.image_url AS "imageUrl", 
                ci.qty, 
                mi.price::text AS "unitPrice", 
                mi.is_available AS "isAvailable"
            FROM cart_items ci 
            INNER JOIN menu_items mi 
                ON mi.id = ci.menu_item_id
            WHERE ci.cart_id = $1
            ORDER BY ci.id ASC
        `;

        const result = await (client ?? pool).query<CheckoutCartItem>(query, [cartId]); 

        return result.rows; 
    }, 

    async create(userId: number, totalAmount: string, client?: PoolClient): Promise<Order> { 
        const query = `
            INSERT INTO orders (
                user_id, 
                status, 
                total_amount
            )
            VALUES ($1, $2, $3)
            RETURNING 
                id, 
                user_id AS "userId", 
                status, 
                total_amount::text AS "totalAmount"
        `; 

        const result = await (client ?? pool).query<Order>(query, [userId, "pending", totalAmount]); 

        const order = result.rows[0];

        if (!order) { 
            throw new Error("Failed to create order"); 
        }

        return order; 
    }, 

    async insertItem(
        orderId: number, 
        menuItemId: number, 
        qty: number, 
        unitPrice: string,
        client?: PoolClient
    ): Promise<void> { 
        const query = `
            INSERT INTO order_items ( 
                order_id, 
                menu_item_id, 
                qty, 
                unit_price
            )
            VALUES ($1, $2, $3, $4)
        `;

        await (client ?? pool).query(query, [
            orderId, 
            menuItemId, 
            qty, 
            unitPrice
        ]); 
    }, 

    async clearCart(cartId: number, client?: PoolClient): Promise<void> { 
        const query = `
            DELETE FROM cart_items 
            WHERE cart_id = $1
        `;

        await (client ?? pool).query(query, [cartId]);
    }, 

    async findAllByUserId(
        userId: number
    ): Promise<Order[]> { 
        const query = `
            SELECT 
                id, 
                user_id AS "userId", 
                status,
                total_amount::text AS "totalAmount"
            FROM orders 
            WHERE user_id = $1
            ORDER BY id DESC
        `;

        const result = await pool.query<Order>( 
            query, 
            [userId]
        ); 

        return result.rows;
    }, 

    async findById(
        orderId: number,
        userId: number
    ): Promise<Order | null> { 
        const query = `
            SELECT 
                id, 
                user_id AS "userId", 
                status, 
                total_amount::text AS "totalAmount"
                FROM orders 
                WHERE id = $1 
                AND user_id = $2
        `; 

        const result = await pool.query<Order>(query, [orderId, userId]); 

        return result.rows[0] ?? null;
    }, 

    async findItemsByOrderId(
        orderId: number, 
        client?: PoolClient,
    ): Promise<OrderItem[]> { 
        const query = `
            SELECT 
                oi.id,
                oi.order_id AS "orderId", 
                oi.menu_item_id AS "menuItemId", 
                mi.name, 
                oi.qty, 
                oi.unit_price::text AS "unitPrice", 
                (oi.unit_price * oi.qty)::text AS subtotal
            FROM order_items oi 
            INNER JOIN menu_items mi 
                ON mi.id = oi.menu_item_id 
            WHERE oi.order_id = $1
            ORDER BY oi.id ASC
        `;

        const result = await (client ?? pool).query<OrderItem>(
            query, 
            [orderId]
        );

        return result.rows; 
    }
};