import {UserProp} from "../interfaces/User";
import axiosInstance from "../utils/axiosInstance";
import {LPNRequestProp} from "../interfaces/LPN";

export const createNewLpn = async (lpnRequestProp: LPNRequestProp): Promise<UserProp> => {
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