export interface ComponentInboundProp {
    sku: string;
    upc: string;
    palletCapacity: number;
}

export interface ComponentProps {
    id: number;
    sku: string;
    inventory: number;
    finish: string;
    category: string;
    images: {
        dim: string[];
        img: string[];
    };
}
