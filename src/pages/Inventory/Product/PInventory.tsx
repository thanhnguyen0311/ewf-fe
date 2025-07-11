import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from "react";
import {getProductsInventory} from "../../../api/apiService";
import {AgGridReact} from "ag-grid-react";
import Loader from "../../UiElements/Loader/Loader";

import {ColDef} from 'ag-grid-community';
import {ProductInventoryProp} from "../../../interfaces/Product";



export default function PInventory() {
    const [products, setProducts] = useState<ProductInventoryProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const gridRef = useRef<AgGridReact<any>>(null);
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const products = await getProductsInventory();
            setProducts(products);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch components. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    const columnDefs: ColDef<ProductInventoryProp>[] = [
        {
            headerName: "",
            width: 25
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
            cellStyle: {fontWeight: "600"}
        },
        {
            headerName: "Local SKU",
            field: "localSku",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
            cellStyle: {fontWeight: "600"}
        },
        {
            headerName: "UPC",
            field: "upc",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
            cellStyle: {fontWeight: "600"}
        },
        {
            headerName: "ASIN",
            field: "asin",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
            cellStyle: {fontWeight: "600"}
        },
        {
            headerName: "Inventory",
            field: "quantity",
            width: 120,
            filter: true,
            cellStyle: (params: any) => {
                return {
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "18px",
                    color: params.data.quantity > 30 ? "green" : params.data.quantity > 5 ? "orange" : "red",
                };
            }
        },
        {
            headerName: "EWFDirect",
            field: "ewfdirect",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "Amazon",
            field: "amazon",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "Wayfair",
            field: "wayfair",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "Cymax",
            field: "cymax",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "Overstock",
            field: "overstock",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "DIS",
            field: "discontinued",
            width: 120,
            filter: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
    ]
    const defaultColDef = {
        resizable: true,
        floatingFilter: true,
        cellStyle: (params: any) => {
            return {
                fontSize: "15px",
                fontWeight: "500",
                textDecoration: params.data.discontinue ? "line-through" : "none",
            };
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [forceUpdate]);

    const onExportCSV = () => {
        gridRef.current?.api.exportDataAsCsv();
    };

    return (
        <>
            <PageMeta
                title="Product Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Inventory"/>

            <div className="flex justify-end mb-4">
                <button className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={onExportCSV}>Export to CSV</button>

                <button
                    onClick={() => setForceUpdate((prev) => prev + 1)}
                    className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    ↻ Refresh
                </button>
            </div>

            <Loader isLoading={loading}>

                <div
                    className="ag-theme-quartz shadow border rounded-xl border-gray-300"
                    style={{height: "800px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (<AgGridReact
                        ref={gridRef}
                        rowData={products} // Pass fetched data to the grid
                        columnDefs={columnDefs} // Define columns
                        defaultColDef={defaultColDef}
                        getRowStyle={(params) => {
                            if (params.data?.discontinue) {
                                // Apply a dark color when "discontinue" is true
                                return {
                                    backgroundColor: "#b4b7ba", // Dark slate gray
                                };
                            }

                            return {
                                backgroundColor: params.node?.rowIndex != null && params.node.rowIndex % 2 === 0 ? "#e4f7f0" : "white",
                            };
                        }}
                        // onCellValueChanged={handleCellValueChanged}
                        rowHeight={30}
                    />) : <></>}
                </div>
                {/*{isZoomed && zoomImage && (*/}
                {/*    <ImageModal image={zoomImage} name="" toggleZoom={toggleZoom} />*/}
                {/*)}*/}

            </Loader>
        </>
    )
}

