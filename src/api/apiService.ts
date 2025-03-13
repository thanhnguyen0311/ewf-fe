import {ComponentProp, ComponentRequestProp} from "../pages/Inventory/Components/CInventory";

export const updateComponent = async (componentRequest: ComponentRequestProp): Promise<ComponentProp> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory/components`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(componentRequest)
    });

    if (!response.ok) {
        throw new Error(`Failed to update component with status: ${response.status}`);
    }
    return response.json();
};
