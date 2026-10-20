import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js"; 
import menuItemRoutes from "../modules/menu-items/menuItem.routes.js";
import cartRoutes from "../modules/carts/cart.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";


const router = Router(); 

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/menu-items", menuItemRoutes); 
router.use("/carts", cartRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);


export default router; 