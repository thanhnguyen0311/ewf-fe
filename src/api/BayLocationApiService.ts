import { BayLocationProp } from "../interfaces/BayLocation";
import axiosInstance from "../utils/axiosInstance";

export const getBayLocations = async (): Promise<BayLocationProp[]> => {
    const response = await axiosInstance.get<BayLocationProp[]>(`/v1/location`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch bay locations with status: ${response.status}`);
    }

    return response.data;
};


