import { Router } from "express";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import { CartController } from "./cart.controller.js";

const router = Router(); 

router.use(authenticateUser);

router.get("/", CartController.getCart); 
router.post("/items", CartController.addItem); 
router.patch("/items/:menuItemId", CartController.updateItem); 
router.delete("/items/:menuItemId", CartController.removeItem);
router.delete("/", CartController.clearCart); 

export default router;