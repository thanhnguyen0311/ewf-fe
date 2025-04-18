import {ComponentProp, ComponentRequestProp} from "../pages/Inventory/Components/CInventory";
import {ProductDetailProp, ProductDetailRequestProp} from "../interfaces/Product";

export const mapComponentPropToRequest = (component: ComponentProp): ComponentRequestProp => {
    const {
        id,
        name,
        inventory,
        discontinue,
        toShip,
        onPO,
        inTransit,
        stockVN,
        inProduction
    } = component;

    return {
        id,
        name,
        inventory,
        discontinue,
        toShip,
        onPO,
        inTransit,
        stockVN,
        inProduction
    };
};


export const mapProductDetailPropToRequest = (product: ProductDetailProp): ProductDetailRequestProp => {
    const {
        id,
        upc,
        asin,
        title,
        localTitle,
        description,
        htmlDescription,
        type,
        collection,
        order,
        category,
        subCategory,
        mainCategory,
        shippingMethod,
        pieces,
        discontinued,
        amazon,
        cymax,
        overstock,
        wayfair,
        ewfdirect,
        houstondirect,
        ewfmain,
    } = product;

    return {
        id,
        upc,
        asin,
        title,
        localTitle,
        description,
        htmlDescription,
        type,
        collection,
        order,
        category,
        subCategory,
        mainCategory,
        shippingMethod,
        pieces,
        discontinued,
        amazon,
        cymax,
        overstock,
        wayfair,
        ewfdirect,
        houstondirect,
        ewfmain,
    };
};