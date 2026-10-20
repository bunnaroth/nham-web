export interface Payment {
    id: number;
    orderId: number;
    userId: number;
    amount: string;
    paidAt: Date;
}

export interface CreatePaymentInput {
    orderId: number;
}