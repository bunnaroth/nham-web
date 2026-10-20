import { pool } from "../../config/db.js";
import type { Payment } from "./payment.types.js";

export const PaymentModel = {
    async findOrderForPayment(
        orderId: number,
        userId: number,
    ): Promise<{ id: number; totalAmount: string } | null> {
        const query = `
            SELECT
                id,
                total_amount::text AS "totalAmount"
            FROM orders
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query<{
            id: number;
            totalAmount: string;
        }>(query, [orderId, userId]);

        return result.rows[0] ?? null;
    },

    async findByOrderId(orderId: number): Promise<Payment | null> {
        const query = `
            SELECT
                id,
                order_id AS "orderId",
                user_id AS "userId",
                amount::text AS amount,
                paid_at AS "paidAt"
            FROM payments
            WHERE order_id = $1
        `;

        const result = await pool.query<Payment>(query, [orderId]);

        return result.rows[0] ?? null;
    },

    async create(
        orderId: number,
        userId: number,
        amount: string,
    ): Promise<Payment> {
        const query = `
            INSERT INTO payments (
                order_id,
                user_id,
                amount
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                order_id AS "orderId",
                user_id AS "userId",
                amount::text AS amount,
                paid_at AS "paidAt"
        `;

        const result = await pool.query<Payment>(query, [
            orderId,
            userId,
            amount,
        ]);

        const payment = result.rows[0];

        if (!payment) {
            throw new Error("Failed to create payment.");
        }

        return payment;
    },

    async findAllByUserId(userId: number): Promise<Payment[]> {
        const query = `
            SELECT
                id,
                order_id AS "orderId",
                user_id AS "userId",
                amount::text AS amount,
                paid_at AS "paidAt"
            FROM payments
            WHERE user_id = $1
            ORDER BY id DESC
        `;

        const result = await pool.query<Payment>(query, [userId]);

        return result.rows;
    },

    async findById(
        paymentId: number,
        userId: number,
    ): Promise<Payment | null> {
        const query = `
            SELECT
                id,
                order_id AS "orderId",
                user_id AS "userId",
                amount::text AS amount,
                paid_at AS "paidAt"
            FROM payments
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query<Payment>(query, [
            paymentId,
            userId,
        ]);

        return result.rows[0] ?? null;
    },
};