import {UserProp, UserRequestDto} from "../interfaces/User";
import axiosInstance from "../utils/axiosInstance";
import {Role} from "../interfaces/Role";

export const getUsers = async (): Promise<UserProp[]> => {
    const response = await axiosInstance.get<UserProp[]>(
        `/v1/users`,
    );

    return response.data
}

export const getRoles = async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>(
        `/v1/roles`,
    );

    return response.data
}

export const updateUser = async (userRequestDto: UserRequestDto): Promise<UserProp> => {
    const response = await axiosInstance.put(`/v1/users`, userRequestDto, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error(`Failed to update product with status: ${response.status}`);
    }

    return response.data;
}