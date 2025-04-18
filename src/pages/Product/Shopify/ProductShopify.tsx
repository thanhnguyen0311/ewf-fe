import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Loader from "../../UiElements/Loader/Loader";
import ComponentCard from "../../../components/common/ComponentCard";
import React, {useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";


export default function ProductShopify() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const gridRef = useRef<AgGridReact<any>>(null);

    return (
        <>
            <PageMeta
                title="Shopify Product Detail"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Detail" />
            <Loader isLoading={loading}>
                <ComponentCard title="">

                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            // onClick={onExportCSV}>Export to CSV
                        >
                        </button>

                        <button
                            // onClick={() => setForceUpdate((prev) => prev + 1)}
                            className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                </ComponentCard>

            </Loader>
        </>
    )
}