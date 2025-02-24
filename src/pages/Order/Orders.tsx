import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import {ordersTableColumns} from "../../config/tableColumns";
import {CustomerType} from "../../config/customerType";
import './Orders.css';


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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders?page=${currentPage}`);
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
            <div className="space-y-6 relative">
                {/* Loader Overlay */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                        <div className="loader border-t-4 border-orange-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                )}
                {/* Component Content (Blurred when loading) */}
                <div className={`${loading ? "filter blur-sm" : ""}`}>

                    <ComponentCard title="">
                        <div
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="max-w-full overflow-x-auto">
                                <div className="min-w-[1102px]">
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                {ordersTableColumns.map((column, index) => (
                                                    <TableCell
                                                        isHeader
                                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                    >
                                                        {column}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHeader>

                                        {/* Table Body */}
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
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
                                                        className="px-4 py-3 font-bold text-gray-500 text-theme-sm dark:text-gray-400">
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

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <div
                                        className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white dark:bg-gray-800">
                                        {/* Page Info */}
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Page {currentPage} of {allPages}
                                        </div>

                                        {/* Pagination Buttons */}
                                        <div className="flex gap-2">
                                            {/* Previous Button */}
                                            <button
                                                className={`px-4 py-2 text-sm font-medium border rounded-lg ${
                                                    currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            >
                                                Previous
                                            </button>

                                            {/* Page Buttons */}
                                            {Array.from({length: 5})
                                                .map((_, index) => currentPage - 2 + index) // Create an array centered around currentPage
                                                .filter((page) => page > 0 && page <= allPages) // Ensure valid page numbers
                                                .map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-1 text-sm font-medium border rounded ${
                                                            currentPage === page
                                                                ? 'bg-orange-400 text-white border-orange-500'
                                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                            {/* Next Button */}
                                            <button
                                                className={`px-4 py-2 text-sm font-medium border rounded-lg ${
                                                    currentPage === allPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                                disabled={currentPage === allPages}
                                                onClick={() => setCurrentPage((prev) => Math.min(allPages, prev + 1))}
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </>
    );
}