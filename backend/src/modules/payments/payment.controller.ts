import type { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service.js";

export const PaymentController = {
    async createPayment(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const payment = await PaymentService.createPayment(
                req.user!.id,
                req.body,
            );
            
            res.status(201).json(payment);
        } catch (error) {
            next(error);
        }
    },

    async getPayments(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const payments = await PaymentService.getPayments(
                req.user!.id,
            );

            res.status(200).json(payments);
        } catch (error) {
            next(error);
        }
    },

    async getPaymentById(
        req: Request<{ paymentId: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const paymentId = Number(req.params.paymentId);

            const payment = await PaymentService.getPaymentById(
                req.user!.id,
                paymentId,
            );

            res.status(200).json(payment);
        } catch (error) {
            next(error);
        }
    },
};