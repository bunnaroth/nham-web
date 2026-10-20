import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { authenticateUser } from "../../middleware/authMiddleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/", PaymentController.createPayment);
router.get("/", PaymentController.getPayments);
router.get("/:paymentId", PaymentController.getPaymentById);

export default router;