import type {
    Request,
    Response,
    NextFunction,
} from "express";
import { OrderService } from "./order.service.js";

export const OrderController = {
    async createOrder(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const order = await OrderService.createOrder(
                req.user!.id,
            );

            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    },

    async getOrders(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const orders = await OrderService.getOrders(
                req.user!.id,
            );

            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

    async getOrderById(
        req: Request<{ orderId: string }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const orderId = Number(req.params.orderId);

            const order = await OrderService.getOrderById(
                req.user!.id,
                orderId,
            );

            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },
};