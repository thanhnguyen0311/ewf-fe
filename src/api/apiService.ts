import {ComponentProp, ComponentRequestProp, data_sort} from "../pages/Inventory/Components/CInventory";
import axiosInstance from "../utils/axiosInstance";


export const updateComponent = async (componentRequest: ComponentRequestProp): Promise<ComponentProp> => {
    const response = await axiosInstance.put("/api/inventory/components", componentRequest, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to update component with status: ${response.status}`);
    }

    return response.data;
};


export const getComponents = async (): Promise<ComponentProp[]> => {
    const response = await axiosInstance.get<ComponentProp[]>(
        `/api/inventory/components`,
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
    const requestBody = {
        page: currentPage,
        sku: searchValue,
    };

    const response = await axiosInstance.post("/api/inventory/products/search", requestBody, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch products.");
    }

    return response.data;
}