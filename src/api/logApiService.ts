import axiosInstance from "../utils/axiosInstance";
import {LPNLog} from "../interfaces/Log";

export const getLPNLog = async (page: number | 0): Promise<LPNLog[]> => {

    const response = await axiosInstance.get(`/v1/history/lpn?page=${page}`, {
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