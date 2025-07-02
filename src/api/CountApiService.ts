import {LPNProp} from "../interfaces/LPN";
import axiosInstance from "../utils/axiosInstance";
import {CountBySKUProp} from "../pages/Count&Search/SearchBySKU";

export const findLpnFromTagIDs = async (countBySKUProp: CountBySKUProp): Promise<LPNProp[]> => {
    const response = await axiosInstance.post(`/v1/counting/sku`, countBySKUProp, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}