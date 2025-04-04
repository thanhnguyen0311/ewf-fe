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
    upc: string;
    asin: string;
    title: string;
    localTitle: string;
    description: string;
    htmlDescription: string;
    type: string;
    collection: string;
    order: string;
    category: string;
    mainCategory: string;
    subCategory: string;
    shippingMethod: string;
    pieces: string;
    discontinued: boolean;
    amazon: boolean;
    cymax: boolean;
    overstock: boolean;
    wayfair: boolean;
    ewfdirect: boolean;
    houstondirect: boolean | false;
    ewfmain: boolean | false;
    components: {id: number;componentId: number; sku: string; quantity: number }[],
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
            headerName: "ORDER",
            field: "order",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
            cellStyle: {fontWeight: "600"},
            pinned: "left"

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
            headerName: "Items",
            field: "components", // Field containing the array of by-products
            sortable: true,
            width: 400,
            filter: "agTextColumnFilter", // Text filter for filtering by component SKUs or quantities
            valueGetter: (params) => {
                const components = params.data?.components as {id: number; componentId: number; sku: string; quantity: number }[] | undefined;
                return components
                    ?.map((item) => `${item.sku} (${item.quantity})`) // Map over components array to get only the SKUs
                    .join(" - ") || "No Components"; // Join the SKUs with a comma and return "No Components" if the array is empty or undefined
            },

            cellStyle: {fontWeight: "500"}, // Optional: Styling
            tooltipField: "components", // Optional: Tooltip for longer values
        },
        {
            headerName: "UPC",
            field: "upc",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "ASIN",
            field: "asin",
            sortable: true,
            width: 180,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Type",
            field: "type",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Collection",
            field: "collection",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "CAT",
            field: "category",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Pieces",
            field: "pieces",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Shipping",
            field: "shippingMethod",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Main Category",
            field: "mainCategory",
            sortable: true,
            width: 120,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Sub Category",
            field: "subCategory",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },


        {
            headerName: "Amazon",
            field: "amazon",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Cymax",
            field: "cymax",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Overstock",
            field: "overstock",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Wayfair",
            field: "wayfair",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "EWFDirect",
            field: "ewfdirect",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "EWFDirect",
            field: "ewfdirect",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "DIS",
            field: "discontinued",
            sortable: true,
            width: 150,
            filter: "agTextColumnFilter",
        },

    ]
    const defaultColDef = {
        resizable: true,
        floatingFilter: true,
        cellStyle: (params: any) => {
            return {
                fontSize: "15px",
                fontWeight: "500",
                textAlign: "center",
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
