import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getOrders);
router.get("/:orderId", OrderController.getOrderById);

export default router;