import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import {ordersTableColumns} from "../../config/tableColumns";
import {CustomerType} from "../../config/customerType";
import Loader from "../UiElements/Loader/Loader";
import {Paging} from "../../components/ui/paging";


export default function Orders() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]); // Store product list
    const [currentPage, setCurrentPage] = useState(1);
    const [allPages, setAllPages] = useState(0);

    // Fetch product data
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/orders?page=${currentPage}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch orders list.");
                }
                const data = await response.json();
                setAllPages(data.totalPages);
                setOrders(data.data); // Save fetched data
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
            } catch (err: any) {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    return (
        <>
            <PageMeta
                title="Orders | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Orders"/>

                    <ComponentCard title="">
                        <div
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="max-w-full overflow-x-auto">
                                <div className="min-w-[1102px]">

                                    <Loader isLoading={loading}>
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader columns={ordersTableColumns}/>

                                        {/* Table Body */}
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {orders.map((order) => (
                                                <TableRow key={order.id} hover={true}>
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                            <span
                                                                className="block font-bold text-gray-800 text-theme-sm dark:text-white/90">
                                                            #{order.invoiceNumber}
                                                            </span>
                                                                {order.ponumber &&
                                                                    <span
                                                                        className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                     PO:{order.ponumber}
                                                                </span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        className={`px-4 py-3 font-bold text-start text-theme-sm dark:text-gray-400 text-gray-500`}>
                                                    <span style={{
                                                        color: CustomerType[order.type as keyof typeof CustomerType],
                                                    }}>
                                                        {order.type}
                                                    </span>
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-start max-w-15 overflow-hidden text-theme-sm dark:text-gray-400">
                                                        <div className="flex -space-x-2">
                                                            <div>
                                                          <span
                                                              className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate overflow-hidden">
                                                                {order.customerName}
                                                          </span>
                                                                {order.ponumber &&
                                                                    <span
                                                                        className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                     {order.customerPhone}
                                                                </span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 font-bold text-amber-700 text-theme-sm dark:text-gray-400">
                                                        {order.price}
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                        {new Date(order.orderDate).toLocaleDateString('en-US')} {/* Converts to MM/DD/YYYY */}
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                        {new Date(order.shipDate).toLocaleDateString('en-US')} {/* Converts to MM/DD/YYYY */}
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        <Badge
                                                            size="sm"
                                                            color={
                                                                order.status === "success"
                                                                    ? "success"
                                                                    : order.status === "pending"
                                                                        ? "warning"
                                                                        : "error"
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        <Badge
                                                            size="sm"
                                                            color={
                                                                order.paymentStatus === "success"
                                                                    ? "success"
                                                                    : order.paymentStatus === "pending"
                                                                        ? "warning"
                                                                        : "error"
                                                            }
                                                        >
                                                            {order.paymentStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell
                                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    </Loader>
                                    <Paging allPages={allPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
        </>
    );
}