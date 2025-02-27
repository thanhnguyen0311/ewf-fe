import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useState} from "react";
import Loader from "../../UiElements/Loader";
import ComponentCard from "../../../components/common/ComponentCard";
import {Table, TableHeader} from "../../../components/ui/table";
import {productsInventoryTableColumns} from "../../../config/tableColumns";

export default function PInventory() {
    const [loading, setLoading] = useState(false);
    return (
        <>
            <PageMeta
                title="Product Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Inventory"/>
            <ComponentCard title="">
                <div
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[1102px]">
                            <Loader isLoading={loading}>
                                <Table>
                                    <TableHeader columns={productsInventoryTableColumns}/>
                                </Table>
                            </Loader>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </>
    )
}