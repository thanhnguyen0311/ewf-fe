import {ImageProp} from "./Image";
import {ComponentProps} from "./Component";

export type ProductDetailProp = {
    id: number;
    sku: string;
    localSku: string;
    upc: string;
    asin: string;
    title: string;
    localTitle: string;
    description: string;
    htmlDescription: string;
    type: string;
    collection: string;
    order: string;
    category: string;
    mainCategory: string;
    subCategory: string;
    shippingMethod: string;
    pieces: string;
    sizeShape: string;
    discontinued: boolean;
    amazon: boolean;
    cymax: boolean;
    overstock: boolean;
    wayfair: boolean;
    ewfdirect: boolean;
    houstondirect: boolean | false;
    ewfmain: boolean | false;
    components: {id: number;componentId: number; sku: string; quantity: number; pos: number }[],
    images: ImageProp | { cgi: [], img: [], dim: []};
    ewfdirectPrice: number;
    ewfdirectManualPrice: number;
    promotion: number;
    dimension: string;
};
export type ProductProp = {
    id: number;
    sku: string;
    localSku: string;
    finish: string;
    category: string;
    inventory: number;
    images: {
        dim: string[];
        img: string[];
    };
    components: ComponentProps[];
    subProducts: ProductProp[];
};
export type ProductDetailRequestProp = {
    id: number;
    upc: string;
    asin: string;
    title: string;
    localTitle: string;
    description: string;
    htmlDescription: string;
    type: string;
    collection: string;
    order: string;
    category: string;
    mainCategory: string;
    subCategory: string;
    shippingMethod: string;
    pieces: string;
    discontinued: boolean;
    amazon: boolean;
    cymax: boolean;
    components: {id: number;quantity: number}[],
    overstock: boolean;
    wayfair: boolean;
    ewfdirect: boolean;
    houstondirect: boolean;
    ewfmain: boolean;
    images: ImageProp;
    ewfdirectManualPrice: number;
    promotion: number;
    dimension: string;
}

export type ProductInventoryProp = {
    id: number;
    sku: string;
    quantity: number;
    asin: string;
    upc: string;
    discontinued: boolean;
    ewfdirect: boolean;
    amazon: boolean;
    cymax: boolean;
    overstock: boolean;
    wayfair: boolean;
    localSku: string;
};
