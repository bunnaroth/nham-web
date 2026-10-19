export interface Cart { 
    id: number; 
    userId: number; 
}

export interface CartItem { 
    id: number; 
    cartId: number; 
    menuItemId: number; 
    name: string; 
    imageUrl: string | null; 
    unitPrice: string; 
    qty: number;
    subtotal: string;
}

export interface CartResponse { 
    id: number; 
    userId: number; 
    items: CartItem[];
    totalAmount: string;
}

export interface AddCartItemInput { 
    menuItemId: number;
    qty: number;
}

export interface UpdateCartItemInput { 
    qty: number; 
}

