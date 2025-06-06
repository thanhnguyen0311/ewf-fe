export interface LPNRequestProp {
    tagID : string;
    sku: string;
    containerNumber: string;
    quantity: number;
    bayCode: string;
    date: string;
}

export interface LPNProp {
    tagID : string;
    sku: string;
    containerNumber: string;
    quantity: number;
    bayCode: string;
    zone: string;
    createdBy: string;
    date: string;
    status: string;
}