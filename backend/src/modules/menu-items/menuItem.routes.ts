import { Router } from "express";
import { MenuItemController } from "./menuItem.controller.js";

const router = Router(); 

router.get("/", MenuItemController.getAllMenuItems); 
router.get("/category/:category", MenuItemController.getMenuByCategory); 
router.get("/:id", MenuItemController.getMenuById); 

router.post("/", MenuItemController.createMenuItem); 
router.patch("/:id", MenuItemController.updateMenuItem); 
router.delete("/:id", MenuItemController.deleteMenuItem); 

export default router;