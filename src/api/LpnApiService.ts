import axiosInstance from "../utils/axiosInstance";
import {LPNEditRequestProp, LPNProp, LPNRequestProp} from "../interfaces/LPN";

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

export const findLpn = async (tagID: string): Promise<LPNProp> => {
    const response = await axiosInstance.get(`/v1/lpn/tag?tagID=${tagID}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}

export const editLpn = async (lpnRequestProp: LPNEditRequestProp): Promise<LPNEditRequestProp> => {
    const response = await axiosInstance.put(`/v1/lpn/edit`, lpnRequestProp, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}

export const putAwayLpn = async (lpnRequestProp: LPNEditRequestProp): Promise<LPNEditRequestProp> => {
    const response = await axiosInstance.put(`/v1/lpn/putaway`, lpnRequestProp, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}

export const breakDownLpn = async (lpnRequestProp: LPNEditRequestProp): Promise<LPNEditRequestProp> => {
    const response = await axiosInstance.put(`/v1/lpn/breakdown`, lpnRequestProp, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}


export const removeLpn = async (tagID: string) => {
    const response = await axiosInstance.delete(`/v1/lpn/remove?tagID=${tagID}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }

    return response.data;
}