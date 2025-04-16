import React, {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import {getProductDetails, updateComponent, updateProductDetail} from "../../api/apiService";

import { ColDef, ColGroupDef } from 'ag-grid-community';
import {mapComponentPropToRequest, mapProductDetailPropToRequest} from "../../utils/mapFunctions";
import {ComponentProp} from "../Inventory/Components/CInventory";


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
    components: {id: number;componentId: number; sku: string; quantity: number; pos: number }[],
};

export type ProductDetailRequestProp = {
    id: number;
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
    houstondirect: boolean;
    ewfmain: boolean;
}

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
    // @ts-ignore
    // @ts-ignore
    const columnDefs: (ColDef | ColGroupDef)[] = [

        {
            headerName: "ORDER",
            field: "order",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: true,
            width: 170,
            editable: true,
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
            children: [
                {
                    headerName: "Total",
                    columnGroupShow: "closed", // Show this column header when collapsed
                    field: "components",      // Ensure this field exists in the row data
                    width: 350,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as {id: number; componentId: number; sku: string; quantity: number; pos: number }[] | undefined;
                        const sortedComponents = (components || []).sort((a, b) => a.pos - b.pos);
                        return sortedComponents
                            .map((item) => `${item.sku} (${item.quantity})`)
                            .join(" | ") || "No Components";
                    },
                    cellStyle: { fontWeight: '500', textAlign: 'start', fontSize: '13px' },
                },
                {
                    headerName: "Item1",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",       // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 1);
                        return item ? `${item.sku} (${item.quantity})` : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },
                {
                    headerName: "Item2",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 2);
                        return item ? `${item.sku} (${item.quantity})` : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },
                {
                    headerName: "Item3",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 3);
                        return item ? `${item.sku} (${item.quantity})` : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },

                {
                    headerName: "Item4",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 4);
                        return item ? `${item.sku} (${item.quantity})`: null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },

                {
                    headerName: "Item5",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 5);
                        return item ? `${item.sku} (${item.quantity})` : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },

                {
                    headerName: "Item6",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string; quantity: number }[] | undefined;

                        const item = components?.find((component) => component.pos === 6);
                        return item ? `${item.sku} (${item.quantity})` : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },

                {
                    headerName: "Item7",
                    columnGroupShow: "open",  // Show this column header when expanded
                    field: "sku",     // Ensure this field exists in the row data
                    width: 140,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => {
                        const components = params.data?.components as { pos: number; sku: string ; quantity: number}[] | undefined;

                        const item = components?.find((component) => component.pos === 7);
                        return item ? `${item.sku} (${item.quantity})`  : null; // Return the 'sku' or null if no match
                    },
                    cellStyle: { fontWeight: '500', fontSize: '13px' },
                },
            ],
            tooltipField: "components",
        },
        {
            headerName: "UPC",
            field: "upc",
            sortable: true,
            width: 180,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "ASIN",
            field: "asin",
            sortable: true,
            width: 180,
            editable: true,
            filter: "agTextColumnFilter",
            onCellClicked: (params) => {
                const asin = params.value;
                if (asin) {
                    window.open(`https://www.amazon.com/dp/${asin}`, "_blank");
                }
            },
            cellStyle: {
                color: "blue",
                fontWeight: "400",
                textDecoration: "underline"},
        },
        {
            headerName: "Type",
            field: "type",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Collection",
            field: "collection",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "CAT",
            field: "category",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Pieces",
            field: "pieces",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Shipping",
            field: "shippingMethod",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Main Category",
            field: "mainCategory",
            sortable: true,
            width: 120,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Sub Category",
            field: "subCategory",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Amazon",
            field: "amazon",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Cymax",
            field: "cymax",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Overstock",
            field: "overstock",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "Wayfair",
            field: "wayfair",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "EWFDirect",
            field: "ewfdirect",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

        {
            headerName: "DIS",
            field: "discontinued",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },

    ]
    const defaultColDef = {
        resizable: true,
        floatingFilter: true,
        cellStyle: (params: any) => {
            return {
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                textDecoration: params.data.discontinue ? "line-through" : "none",
            };
        }
    };

    const handleCellValueChanged = async (event: any) => {
        const productProp = event.data;
        const productDetailRequestDto = mapProductDetailPropToRequest(productProp)
        try {
            const updateProduct: ProductDetailProp = await updateProductDetail(productDetailRequestDto);
            event.node.setData(updateProduct); // Update grid row with the updated data
            // message.success("Product details updated successfully!"); // Show success notification
        } catch (error: any) {
            console.error("Error updating product details:", error);

            // Displaying the error using an Ant Design message or custom pop-up
            // message.error(error.message || "An error occurred while updating the product. Please try again.");
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
                title="Product Management | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Management"/>

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
                    style={{height: "1000px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (<AgGridReact
                        ref={gridRef}
                        rowData={products} // Pass fetched data to the grid
                        columnDefs={columnDefs} // Define columns
                        defaultColDef={defaultColDef}
                        headerHeight={25}
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
                        onCellValueChanged={handleCellValueChanged}
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
