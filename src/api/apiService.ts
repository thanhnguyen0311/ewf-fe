import {ComponentProp, ComponentRequestProp, data_sort} from "../pages/Inventory/Components/CInventory";
import axios from "axios";

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

export const getComponents = async (): Promise<ComponentProp[]> => {
    const response = await axios.get<ComponentProp[]>(
        `${process.env.REACT_APP_API_URL}/api/inventory/components`
    );
    const sortOrder = data_sort.split(',');

    return response.data
        .map((component) => {
            component.salesReport = component.salesReport * 2 + 1;
            return component;
        })
        .filter((component) => {
            return sortOrder.includes(component.sku);
        })
        .sort((a, b) => {
            const aIndex = sortOrder.indexOf(a.sku);
            const bIndex = sortOrder.indexOf(b.sku);
            return aIndex - bIndex;
        });
}

export const productSearch= async (searchValue: string, currentPage: number) => {
    try {
        const requestBody = {
            page: currentPage,
            sku: searchValue
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory/products/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products.");
        }

        return await response.json()
    } catch (err) {
        console.error(err);
    }
}