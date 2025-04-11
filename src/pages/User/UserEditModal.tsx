import React, { useState } from "react";
import {UserProp} from "../../interfaces/User";
import {Role} from "../../interfaces/Role";
import {getRoles} from "../../api/UserApiService";

interface UserEditModalProps {
    user: UserProp | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: UserProp) => void;
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
    const [editedUser, setEditedUser] = useState<UserProp | null>(user);
    const [roles,setRoles] = useState<Role[] | null>([]);

    const fetchRoles = async () => {
        try {
            const role = await getRoles();
            setRoles(role);
        } catch (error) {
            console.log("Failed to fetch components. Please try again.");
        }
    }

    // Sync state if a new user is selected
    React.useEffect(() => {
        setEditedUser(user);
        fetchRoles()
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editedUser) {
            setEditedUser({ ...editedUser, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedUser) {
            onSave(editedUser);
        }
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={editedUser?.firstName || ""}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={editedUser?.lastName || ""}
                            onChange={handleInputChange}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">Email</label>
                        <input
                            type="text"
                            name="lastName"
                            value={editedUser?.email}
                            className="w-full rounded-md border-none text-warning-700 px-3 py-2"
                            readOnly={true}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">Role</label>
                        <select
                            name="role"
                            value={editedUser?.roleId || ""} // Preselect the current user's role based on roleId
                            onChange={(e) => {
                                const selectedRoleId = parseInt(e.target.value); // Get selected role ID
                                const selectedRole = roles?.find(role => role.id === selectedRoleId); // Find the role object
                                if (editedUser && selectedRole) {
                                    setEditedUser({
                                        ...editedUser,
                                        role: selectedRole.slug,
                                        roleId: selectedRole.id,
                                    });
                                }
                            }}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="" disabled>Select a Role</option>
                            {roles?.map((role) => (
                                <option key={role.id} value={role.id}>
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
                                checked={editedUser?.isActive || false} // Default to the current value of isActive
                                onChange={(e) => {
                                    if (editedUser) {
                                        setEditedUser({ ...editedUser, isActive: e.target.checked });
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
            </div>
        </div>
    );
}