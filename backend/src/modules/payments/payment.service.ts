import { PaymentModel } from "./payment.model.js";
import type {
    CreatePaymentInput,
    Payment,
} from "./payment.types.js";

export const PaymentService = {
    async createPayment(
        userId: number,
        input: CreatePaymentInput,
    ): Promise<Payment> {
        if (!Number.isInteger(input.orderId) || input.orderId <= 0) {
            const error: any = new Error("Invalid order ID.");
            error.status = 400;
            throw error;
        }

        const order = await PaymentModel.findOrderForPayment(
            input.orderId,
            userId,
        );

        if (!order) {
            const error: any = new Error("Order was not found.");
            error.status = 404;
            throw error;
        }

        const existingPayment = await PaymentModel.findByOrderId(order.id);

        if (existingPayment) {
            const error: any = new Error(
                "This order has already been paid.",
            );
            error.status = 409;
            throw error;
        }

        return PaymentModel.create(
            order.id,
            userId,
            order.totalAmount,
        );
    },

    async getPayments(userId: number): Promise<Payment[]> {
        return PaymentModel.findAllByUserId(userId);
    },

    async getPaymentById(
        userId: number,
        paymentId: number,
    ): Promise<Payment> {
        if (!Number.isInteger(paymentId) || paymentId <= 0) {
            const error: any = new Error("Invalid payment ID.");
            error.status = 400;
            throw error;
        }

        const payment = await PaymentModel.findById(paymentId, userId);

        if (!payment) {
            const error: any = new Error("Payment was not found.");
            error.status = 404;
            throw error;
        }

        return payment;
    },
};