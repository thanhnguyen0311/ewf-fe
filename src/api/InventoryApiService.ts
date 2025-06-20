import axiosInstance from "../utils/axiosInstance";

export const getLooseInventory = async (lpnTagId: string): Promise<number> => {

    const response = await axiosInstance.get(`/v1/inventory/lpn`, {
        params: { lpnTagId }, // Send lpnTagId as a query parameter
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }
    console.log(response.data);
    return response.data;
};