import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js"; 
const router = Router(); 

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

export default router; 