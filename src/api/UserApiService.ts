import {UserProp, UserRequestDto} from "../interfaces/User";
import axiosInstance from "../utils/axiosInstance";
import {Role} from "../interfaces/Role";

export const getUsers = async (): Promise<UserProp[]> => {
    const response = await axiosInstance.get<UserProp[]>(
        `/api/users`,
    );

    return response.data
}

export const getRoles = async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>(
        `/api/roles`,
    );

    return response.data
}

export const updateUser = async (userRequestDto: UserRequestDto): Promise<UserProp> => {
    const response = await axiosInstance.put(`/api/users`, userRequestDto, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to update product with status: ${response.status}`);
    }

    return response.data;
}