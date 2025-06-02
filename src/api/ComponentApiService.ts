import { ComponentInboundProp } from "../interfaces/Component";
import axiosInstance from "../utils/axiosInstance";

export const getComponentInbound = async (): Promise<ComponentInboundProp[]> => {
    const response = await axiosInstance.get<ComponentInboundProp[]>(`/v1/component/inbound`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch bay locations with status: ${response.status}`);
    }

    return response.data;
};


