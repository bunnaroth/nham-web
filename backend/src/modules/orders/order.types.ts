export type OrderStatus = | "pending" | "preparing" | "completed" | "cancelled"; 

export interface OrderItem { 
    id: number; 
    orderId: number; 
    menuItemId: number; 
    name: string; 
    imageUrl: string | null; 
    qty: number; 
    unitPrice: string; 
    subtotal: string; 
}

export interface Order { 
    id: number; 
    userId: number; 
    status: OrderStatus; 
    totalAmount: string;
}

export interface OrderResponse extends Order { 
    items: OrderItem[];
}

export interface CheckoutCartItem { 
    menuItemId: number; 
    name: string; 
    imageUrl: string | null; 
    qty: number;
    unitPrice: string; 
    isAvailable: boolean; 
}