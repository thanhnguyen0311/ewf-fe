export interface OrderListResponseDto {
    id: number;
    invoiceNumber: string;
    type: string;
    orderDate: string; // use string if date will be serialized from backend as ISO string
    shipDate: string;
    carrier: string;
    paymentStatus: string;
    price: number;
    customerName: string;
    customerPhone: string;
    status: string;
    tracking: string;
    PONumber: string;
}