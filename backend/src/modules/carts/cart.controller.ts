import { Request, Response, NextFunction } from "express";
import { CartService } from "./cart.service.js";
import { AddCartItemInput, UpdateCartItemInput } from "./cart.types.js";

export const CartController = { 
    async getCart( 
        req: Request, 
        res: Response, 
        next: NextFunction
    ): Promise<void> { 
        try { 
            const userId = req.user!.id; 
            const cart = await CartService.getCart(userId); 

            res.status(200).json(cart); 
        } catch (error) { 
            next (error); 
        }
    }, 

    async addItem( 
        req: Request<{}, {}, AddCartItemInput>, 
        res: Response, 
        next: NextFunction,
    ): Promise<void> { 
        try { 
            const userId = req.user!.id; 
            const cart = await CartService.addItem( 
                userId, 
                req.body,
            ); 

            res.status(201).json(cart); 
        } catch (error) { 
            next(error);
        }
    }, 

    async updateItem( 
        req: Request<{menuItemId: string}, {}, UpdateCartItemInput>, 
        res: Response, 
        next: NextFunction, 
    ): Promise<void> { 
        try { 
            const userId = req.user!.id; 
            const menuItemId = Number(req.params.menuItemId); 

            const cart = await CartService.updateItem( 
                userId, 
                menuItemId, 
                req.body
            ); 

            res.status(200).json(cart); 
        } catch (error) { 
            next(error);
        }
    }, 

    async removeItem( 
        req: Request<{menuItemId: string}>, 
        res: Response, 
        next: NextFunction
    ): Promise<void> { 
        try { 
            const userId = req.user!.id; 
            const menuItemId = Number(req.params.menuItemId); 

            const cart = await CartService.removeItem(
                userId, 
                menuItemId
            ); 

            res.status(200).json(cart); 
        } catch (error) { 
            next(error);
        }
    }, 

    async clearCart(
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<void> { 
        try { 
            const userId = req.user!.id; 
            const cart = await CartService.clearCart(userId); 

            res.status(200).json(cart); 
        } catch (error) { 
            next(error);
        }
    },
};