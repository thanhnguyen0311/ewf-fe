import axiosInstance from "../utils/axiosInstance";
import {LPNProp, LPNRequestProp} from "../interfaces/LPN";

export const createNewLpn = async (lpnRequestProp: LPNRequestProp): Promise<LPNRequestProp> => {
    const response = await axiosInstance.post(`/v1/lpn/new`, lpnRequestProp, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}

export const getAllLpn = async (): Promise<LPNProp[]> => {
    const response = await axiosInstance.get(`/v1/lpn`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}