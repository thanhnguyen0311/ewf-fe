import React, {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import {getProductDetails} from "../../api/apiService";

import {ColDef} from 'ag-grid-community';


export type ProductDetailProp = {
    id: number;
    sku: string;
    localSku: string;
    image: string;
    upc: string;
    asin: string;
    title: string;
    localTitle: string;
    description: string;
    type: string;
    shippingMethod: string;
    pieces: string;
    discontinued: boolean;
    components: { componentSku: string; quantity: number }[],

};

export default function ProductSheet() {
    const [products, setProducts] = useState<ProductDetailProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const products = await getProductDetails();
            for (let i = 0; i < products.length; i++) {
                if (i === 500) break;
                products[i].components = [
                    {componentSku: "COMP123", quantity: 2},
                    {componentSku: "COMP456", quantity: 5},
                ];
            }
            setProducts(products);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch components. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    const columnDefs: ColDef[] = [
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
            headerName: "Items",
            field: "components", // Field containing the array of by-products
            sortable: true,
            filter: "agTextColumnFilter", // Text filter for filtering by component SKUs or quantities
            cellRenderer: (params: { value: { componentSku: string; quantity: number; }[]; data: { sku: any; }; }) => {
                // Check if the value exists, and map it to a readable string with a button
                return (
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <span>
                        {params.value
                            ? params.value
                                .map((item: { componentSku: string; quantity: number }) =>
                                    `${item.componentSku} (${item.quantity})`
                                )
                                .join(" | ")
                            : ""}
                    </span>
                        <button
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor: "pointer",
                            }}
                            onClick={() => alert(`Clicked for ${params.data.sku}`)} // Example action
                        >
                            Info
                        </button>
                    </div>
                );
            },

            cellStyle: {fontWeight: "500"}, // Optional: Styling
            tooltipField: "components", // Optional: Tooltip for longer values
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
        gridRef.current?.api.exportDataAsCsv(); // Trigger the CSV export
    };


    return (
        <>
            <PageMeta
                title="Product Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Inventory"/>

            <div className="flex justify-end mb-4">
                <button
                    className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={onExportCSV}>Export to CSV
                </button>

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
