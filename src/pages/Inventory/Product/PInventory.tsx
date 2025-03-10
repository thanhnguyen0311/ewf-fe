import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from "react";
import Loader from "../../UiElements/Loader/Loader";
import ComponentCard from "../../../components/common/ComponentCard";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../../components/ui/table";
import {productsInventoryTableColumns} from "../../../config/tableColumns";
import Badge from "../../../components/ui/badge/Badge";
import {Paging} from "../../../components/ui/paging";
import {Link} from "react-router-dom";

export default function PInventory() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]); // Store product list
    const [currentPage, setCurrentPage] = useState(1);
    const [allPages, setAllPages] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLoading(true)
        setCurrentPage(1)
        setInputValue(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            fetchProducts(value); // Trigger API only after typing stops
        }, 500); // Set debounce delay to 500ms
    };

    const fetchProducts = async (searchValue: string) => {
        setLoading(true);
        try {
            const requestBody = {
                page: currentPage,
                sku: searchValue.trim()
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory/products/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("Failed to fetch products.");
            }

            const data = await response.json();
            setAllPages(data.totalPages);
            setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchProducts(inputValue);
    }, [currentPage]);

    return (
        <>
            <PageMeta
                title="Product Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Inventory"/>
            <div
                className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
            >
                {/* Card Header */}
                <div className="px-6 py-5">

                    {/* Search Bar */}
                    <div className=" px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                        {/* Search Bar */}
                        <div className="relative flex items-center w-80 ">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Search products by SKU..."
                                className="w-full px-4 py-2  rounded-lg text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            />
                        </div>

                        {/* Checkbox Filter */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="lowStockOnly"
                                className="form-checkbox h-5 w-5 text-orange-400"
                            />
                            <label
                                htmlFor="lowStockOnly"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Low Stock Only
                            </label>
                        </div>

                        {/* Dropdown Filter */}
                        <div className="relative">
                            <select
                                className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            >
                                <option value="all">All Categories</option>
                                <option value="furniture">Furniture</option>
                                <option value="appliances">Appliances</option>
                                <option value="decor">Home Decor</option>
                            </select>
                        </div>

                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                        <div
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="max-w-full overflow-x-auto">
                                <div className="min-w-[1102px]">
                                    <Loader isLoading={loading}>
                                        <Table>
                                            <TableHeader columns={productsInventoryTableColumns}/>

                                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                {products?.map((product) => (
                                                    <TableRow key={product.id} hover={true}>
                                                        <TableCell className="px-2 py-2 sm:px-4 text-start">
                                                            <div className="flex items-center gap-3 ">
                                                                <div className="w-15 h-15 rounded-full" style={{alignContent: "center"}}>
                                                                    {product.image ? <img src={product.image} alt={product.sku} /> : ""}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className={`px-4 py-3 font-bold text-start text-theme-sm dark:text-gray-400 text-gray-500`}>
                                                            <Link  to={`/product/${product.sku}`}
                                                                   className="text-gray-500  font-bold text-theme-md p-2 text-start text-theme-md dark:text-gray-400 hover:text-warning-500">{product.sku}
                                                            </Link>
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-start max-w-15 overflow-hidden text-theme-sm dark:text-gray-400">
                                                            <div className={`flex font-bold -space-x-2 ${product.quantity < 1 ? "text-red-500" : product.quantity < 5 ? "text-yellow-500" : "text-green-500"} }`}>
                                                                {product.quantity <= 0 ? 0 : product.quantity}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3  text-gray-500 text-theme-sm dark:text-gray-400">
                                                            {product.inProduction ? product.inProduction : 0}
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                            {product.inTransit ? product.inTransit : 0}
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                            {product.ordered ? product.ordered : 0}
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                            {product.pendingOrders ? product.pendingOrders : 0}
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                            0
                                                        </TableCell>

                                                        <TableCell
                                                            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                            <Badge
                                                                size="sm"
                                                                color={
                                                                    product.quantity >= 5
                                                                        ? "success"
                                                                        : product.quantity > 0
                                                                            ? "warning"
                                                                            : "error"
                                                                }
                                                            >
                                                                {product.quantity >= 5
                                                                    ? "In Stock"
                                                                    : product.quantity > 0
                                                                        ? "Limited"
                                                                        : "Out of Stock"}
                                                            </Badge>
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
                    </div>
                </div>
            </div>
        </>
    )
}

