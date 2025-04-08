import React, {useEffect, useState} from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import Loader from "../UiElements/Loader/Loader";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import {ordersTableColumns, usersTableColumns} from "../../config/tableColumns";
import {CustomerType} from "../../config/customerType";
import Badge from "../../components/ui/badge/Badge";
import {Paging} from "../../components/ui/paging";

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]); // Store product list

    useEffect(() => {
        // const fetchProducts = async () => {
            setLoading(true);
        //     try {
        //         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders?page=${currentPage}`);
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch orders list.");
        //         }
        //         const data = await response.json();
        //         setAllPages(data.totalPages);
        //         setOrders(data.data); // Save fetched data
        //         await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
        //     } catch (err: any) {
        //         setLoading(false);
        //     }
        // };
        //
        // fetchProducts();
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
                    <div
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">

                                <Loader isLoading={loading}>
                                    <Table>
                                        <TableHeader columns={usersTableColumns}/>

                                        {/* Table Body */}

                                    </Table>

                                </Loader>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}