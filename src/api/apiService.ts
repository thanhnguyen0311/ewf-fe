import {ComponentProp, ComponentRequestProp, data_sort} from "../pages/Inventory/Components/CInventory";
import axiosInstance from "../utils/axiosInstance";
import {ProductProp} from "../pages/Inventory/Product/PInventory";
import {ProductDetailProp} from "../pages/Product/ProductSheet";


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


export const getComponentsInventory = async (): Promise<ComponentProp[]> => {

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

export const getProductsInventory = async (): Promise<ProductProp[]> => {
    const response = await axiosInstance.get<ProductProp[]>(
        `/api/inventory/products`,
    );

    return response.data
}

export const getProductDetails = async (): Promise<ProductDetailProp[]> => {
    const response = await axiosInstance.get<ProductDetailProp[]>(
        `/api/product/all`,
    );

    return response.data
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