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

export const mapComponentsToMinimalFormat = (
    components: { id: number; componentId: number; sku: string; quantity: number; pos: number }[]
): { id: number; quantity: number }[] => {
    return components.map((component) => ({
        id: component.id, // Extract the "id"
        quantity: component.quantity, // Extract the "quantity"
    }));
};

export const mapProductDetailPropToRequest = (
    product: ProductDetailProp
): ProductDetailRequestProp => {
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
        images,
        components, // Include components from the input object
        ewfdirectManualPrice,
        promotion,
        dimension, // Include the required 'dimension' property
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
        images,
        houstondirect,
        ewfmain,
        components: mapComponentsToMinimalFormat(components), // Apply mapping to components
        ewfdirectManualPrice,
        promotion,
        dimension, // Add 'dimension' to the returned object
    };
};