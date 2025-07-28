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

export interface LPNEditRequestProp {
    tagID : string;
    sku: string;
    containerNumber: string;
    quantity: number;
    bayCode: string;
    status: string;
    date: string;
}

export function mapLPNToEditRequest(lpn: LPNProp): LPNEditRequestProp {
    return {
        tagID: lpn.tagID,
        sku: lpn.sku,
        containerNumber: lpn.containerNumber,
        quantity: lpn.quantity,
        bayCode: lpn.bayCode,
        status: lpn.status,
        date: lpn.date
    };
}
