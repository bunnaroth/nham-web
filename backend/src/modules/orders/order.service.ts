import { OrderModel } from "./order.model.js";
import type {
    Order,
    OrderResponse,
} from "./order.types.js";

import { pool } from "../../config/db.js";
import { validatePositiveInteger } from "../../utils/validation.js";

export const OrderService = {
    async createOrder(userId: number): Promise<OrderResponse> {
        validatePositiveInteger(userId, "User ID");
        const client = await pool.connect(); 
        let transactionStarted = false; 
        
        try { 
            await client.query("BEGIN"); 
            transactionStarted = true; 

            const cart = await OrderModel.findCartByUserId(userId);

            if (!cart) {
                const error: any = new Error("Cart was not found.");
                error.status = 404;
                throw error;
            }

            const cartItems = await OrderModel.findCartItemsForCheckout(
                cart.id,
            );

            if (cartItems.length === 0) {
                const error: any = new Error(
                    "Cannot create an order from an empty cart.",
                );
                error.status = 400;
                throw error;
            }

            const unavailableItem = cartItems.find(
                (item) => !item.isAvailable,
            );

            if (unavailableItem) {
                const error: any = new Error(
                    `${unavailableItem.name} is currently unavailable.`,
                );
                error.status = 400;
                throw error;
            }

            const totalCents = cartItems.reduce(
                (sum, item) =>
                    sum +
                    Math.round(Number(item.unitPrice) * 100) * item.qty,
                0,
            );

            const totalAmount = (totalCents / 100).toFixed(2);

            const order: Order = await OrderModel.create(
                userId,
                totalAmount,
            );

            for (const item of cartItems) {
                await OrderModel.insertItem(
                    order.id,
                    item.menuItemId,
                    item.qty,
                    item.unitPrice,
                );
            }

            await OrderModel.clearCart(cart.id);

            const items = await OrderModel.findItemsByOrderId(order.id);

            return {
                ...order,
                items,
            };
        } catch (error) { 
            if (transactionStarted) { 
                try { 
                    await client.query("ROLLBACK");
                } catch { 
                    
                }
            }

            throw error;
        } finally { 
            client.release();
        }
    }, 


    async getOrders(userId: number): Promise<Order[]> {
        validatePositiveInteger(userId, "User ID");
        return OrderModel.findAllByUserId(userId);
    },

    async getOrderById(
        userId: number,
        orderId: number,
    ): Promise<OrderResponse> {
        validatePositiveInteger(userId, "User ID");
        validatePositiveInteger(orderId, "Order ID");

        const order = await OrderModel.findById(orderId, userId);

        if (!order) {
            const error: any = new Error("Order was not found.");
            error.status = 404;
            throw error;
        }

        const items = await OrderModel.findItemsByOrderId(order.id);

        return {
            ...order,
            items,
        };
    },
};
