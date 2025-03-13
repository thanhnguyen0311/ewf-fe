import {ComponentProp, ComponentRequestProp} from "../pages/Inventory/Components/CInventory";

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