import { AddCartItemInput, CartResponse, UpdateCartItemInput } from "./cart.types.js";
import { CartModel } from "./cart.model.js";

export const CartService = { 
    async getCart(userId: number): Promise<CartResponse> { 
        let cart = await CartModel.findLatestByUserId(userId); 

        if (!cart) { 
            cart = await CartModel.create(userId); 
        }

        const items = await CartModel.findItemsByCartId(cart.id); 

        const total = items.reduce(
            (sum, item) => sum + Number(item.subtotal), 0
        ); 

        return { 
            id: cart.id, 
            userId: cart.userId, 
            items, 
            totalAmount: total.toFixed(2)
        };
    }, 

    async addItem(
        userId: number, 
        input: AddCartItemInput, 
    ): Promise<CartResponse> { 
        let cart = await CartModel.findLatestByUserId(userId); 

        if (!cart) { 
            cart = await CartModel.create(userId); 
        }

        const menuItem = await CartModel.findAvailableMenuItem(
            input.menuItemId
        ); 

        if (!menuItem) { 
            const error: any = new Error(
                `Menu item with ID ${input.menuItemId} was not found in the cart.`
            ); 

            error.status = 404; 
            throw error; 
        }

        const existingItem = await CartModel.findItemByMenuItemId( 
            cart.id, 
            input.menuItemId,
        ); 

        if (existingItem) { 
            await CartModel.updateItemQuantity(
                existingItem.id, 
                existingItem.qty + input.qty
            ); 

            await CartModel.updateItemPrice( 
                existingItem.id, 
                menuItem.price
            ); 
        } else { 
            await CartModel.insertItem( 
                cart.id, 
                input.menuItemId,
                menuItem.price, 
                input.qty
            ); 
        }

        return this.getCart(userId);
    }, 

    async updateItem( 
        userId: number, 
        menuItemId: number, 
        input: UpdateCartItemInput
    ): Promise<CartResponse> { 
        const cart = await CartModel.findLatestByUserId(userId); 

        if (!cart) { 
            const error: any = new Error("Cart was not found."); 
            error.status = 404; 
            throw error; 
        }

        const existingItem = await CartModel.findItemByMenuItemId( 
            cart.id, 
            menuItemId
        ); 

        if (!existingItem) { 
            const error: any = new Error( 
                `Menu item with ID ${menuItemId} was not found in the cart.`
            ); 

            error.status = 404; 
            throw error; 
        }

        await CartModel.updateItemQuantity(
            existingItem.id, 
            input.qty
        ); 

        return this.getCart(userId);
    }, 

    async removeItem(
        userId: number, 
        menuItemId: number
    ):Promise<CartResponse> { 
        const cart = await CartModel.findLatestByUserId(userId); 

        if(!cart) { 
            const error: any = new Error("Cart was not found."); 
            error.status = 404; 
            throw error; 
        }

        const deleted = await CartModel.deleteItem(
            cart.id, 
            menuItemId
        ); 

        if (!deleted) { 
            const error: any = new Error( 
                `Menu item with ID ${menuItemId} was not found in the cart.`
            ); 
            error.status = 404;
            throw error; 
        }

        return this.getCart(userId); 
    }, 

    async clearCart(userId: number): Promise<CartResponse> { 
        const cart = await CartModel.findLatestByUserId(userId); 

        if (cart) { 
            await CartModel.clearItems(cart.id); 
        }

        return this.getCart(userId); 
    }, 
}; 