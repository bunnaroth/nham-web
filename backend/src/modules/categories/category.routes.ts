import { Router } from "express";
import { CategoryController } from "./category.controller.js";

const router = Router();

router.get('/', CategoryController.getAllCategories); 
router.get('/:name', CategoryController.getCategoryByName); 

export default router;