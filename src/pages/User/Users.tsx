import React, {useEffect, useState} from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Loader from "../UiElements/Loader/Loader";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import {usersTableColumns} from "../../config/tableColumns";
import {formatDate} from "../../utils/formatDate";
import UserEditModal from "./UserEditModal";
import {mapUserPropToDto, UserProp} from "../../interfaces/User";
import {getUsers, updateUser} from "../../api/UserApiService";
import Button from "../../components/ui/button/Button";
import UserCreateModal from "./UserCreateModal";



export default function Users() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserProp[]>([]); // Store product list
    const [isModalOpen, setModalOpen] = useState(false);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProp | null>(null);



    const handleEditClick = (user: UserProp) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setCreateUserModalOpen(false)
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleSave = async (editedUser: UserProp) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === editedUser.id ? editedUser : user))
        );
        const userRequestDto = mapUserPropToDto(editedUser)
        try {
            await updateUser(userRequestDto);
        } catch (error: unknown) {
            console.error("Error updating product details:", error);
        }
    };


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const users = await getUsers();
            setUsers(users);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch components. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <PageMeta
                title="User Management | East West Furniture "
                description="User Management"
            />

            <PageBreadcrumb pageTitle="User Management" />
            <div className="space-y-6">


                <ComponentCard title="">
                    <div className="flex justify-start mb-4">
                        <Button size="sm"
                                variant="outline"
                                className={"mr-1.5 flex items-center"}
                                onClick={() => setCreateUserModalOpen(true)}
                        >
                            Add
                        </Button>
                    </div>

                    <div
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">

                                <Loader isLoading={loading}>
                                    {error ? (
                                        <div className="text-red-500 font-bold p-4">{error}</div> // Add this
                                    ) : (

                                        <Table>
                                        <TableHeader columns={usersTableColumns}/>

                                        {/* Table Body */}
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {users.map((user, index) => (
                                                <TableRow key={user.id} hover={true}>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {user.firstName}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {user.lastName}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-warning-700 font-medium text-start text-theme-sm ">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {user.role}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {formatDate(user.createdAt)}

                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
                                                        {formatDate(user.lastLogin)}
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-success-700 font-medium text-start text-theme-sm ">
                                                        Online
                                                    </TableCell>
                                                    <TableCell
                                                        className={`px-4 py-3  font-medium text-start text-theme-sm  ${user.isActive ? 'text-success-600' : 'text-red-600'}`}>
                                                        {user.isActive ? "✅" : "X"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.roleId !== 2 && <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            ✏️
                                                        </button>}
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                    )}

                                </Loader>

                                <UserEditModal
                                    user={selectedUser}
                                    isOpen={isModalOpen}
                                    onClose={handleModalClose}
                                    onSave={handleSave}
                                />

                                {isCreateUserModalOpen &&
                                    <UserCreateModal onClose={handleModalClose} />
                                }

                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}