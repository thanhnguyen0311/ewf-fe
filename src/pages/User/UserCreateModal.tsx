import React, { useState } from "react";
import {UserCreateRequestDto} from "../../interfaces/User";
import {Role} from "../../interfaces/Role";
import {createUser, getRoles} from "../../api/UserApiService";
import {useNotification} from "../../context/NotificationContext";
import Loader from "../UiElements/Loader/Loader";

const defaultUserRequest: UserCreateRequestDto = {
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    roleSlug : "USER",
    status: false
};


interface UserCreateModalProps {
    onClose: () => void;
}

export default function UserCreateModal({ onClose }: UserCreateModalProps) {
    const [newUser, setNewUser] = useState<UserCreateRequestDto | null>(defaultUserRequest);
    const [roles,setRoles] = useState<Role[] | null>([]);
    const {sendNotification} = useNotification();
    const [loading, setLoading] = useState<boolean>(false);


    const fetchRoles = async () => {
        try {
            const role = await getRoles();
            setRoles(role);
        } catch (error) {
            sendNotification(
                "error",
                "Error",
                "Please fill all required fields before submitting."
            );
        }
    }

    // Sync state if a new user is selected
    React.useEffect(() => {
        fetchRoles()
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Validate required fields
        if (
            !newUser?.firstName ||
            !newUser?.email ||
            !newUser?.password ||
            !newUser?.roleSlug
        ) {
            sendNotification(
                "error",
                "Error",
                "Please fill all required fields before submitting."
            );
            setLoading(false);
            return;
        }

        try {
            await createUser(newUser);

            // Notify user of success
            sendNotification(
                "success",
                "Success",
                "User has been saved successfully",
                {
                    showLink: false,
                    autoHideDuration: 4000, // Optional: 4 seconds timeout
                }
            );

            setNewUser(defaultUserRequest)
            onClose();

        } catch (error) {
            // Handle API request error
            console.error("Error creating new LPN:", error);
            sendNotification(
                "error",
                "Submission Failed",
                "Failed to save the LPN Request. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <Loader isLoading={loading}>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Create new user</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={newUser?.firstName || ""}
                                onChange={(e) => {
                                    if (newUser) {
                                        setNewUser({ ...newUser, firstName: e.target.value });
                                    }
                                }}
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={newUser?.lastName || ""}
                                onChange={(e) => {
                                    if (newUser) {
                                        setNewUser({ ...newUser, lastName: e.target.value });
                                    }
                                }}
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Email</label>
                            <input
                                type="text"
                                name="lastName"
                                value={newUser?.email || ""}
                                onChange={(e) => {
                                    if (newUser) {
                                        setNewUser({ ...newUser, email: e.target.value });
                                    }
                                }}
                                className="w-full rounded-md text-warning-700 px-3 py-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                name="lastName"
                                value={newUser?.password || ""}
                                onChange={(e) => {
                                    if (newUser) {
                                        setNewUser({ ...newUser, password: e.target.value });
                                    }
                                }}
                                className="w-full rounded-md text-warning-700 px-3 py-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Role</label>
                            <select
                                name="role"
                                value={newUser?.roleSlug || ""} // Preselect the current user's role based on roleId
                                onChange={(e) => {
                                    const selectedRoleSlug = e.target.value; // Get selected role ID
                                    const selectedRole = roles?.find(role => role.slug === selectedRoleSlug); // Find the role object
                                    if (newUser && selectedRole) {
                                        setNewUser({
                                            ...newUser,
                                            roleSlug: selectedRole.slug,
                                        });
                                    }
                                }}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="" disabled>Select a Role</option>
                                {roles?.map((role) => (
                                    <option key={role.slug} value={role.slug}>
                                        {role.slug}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={newUser?.status || false} // Default to the current value of isActive
                                    onChange={(e) => {
                                        if (newUser) {
                                            setNewUser({ ...newUser, status: e.target.checked });
                                        }
                                    }}
                                    className="mr-2"
                                />
                                Active
                            </label>
                        </div>

                        <div className="flex justify-between mt-15">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Loader>
            </div>
        </div>
    );
}