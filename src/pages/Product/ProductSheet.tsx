import React, {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import {getProductDetails, updateProductDetail} from "../../api/apiService";

import { ColDef, ColGroupDef } from 'ag-grid-community';
import {mapProductDetailPropToRequest} from "../../utils/mapFunctions";
import {ProductDetailProp} from "../../interfaces/Product";
import {ImageProp} from "../../interfaces/Image";
import ProductImageModal from "../UiElements/Modal/Image/ImageModal";



export default function ProductSheet() {
    const [products, setProducts] = useState<ProductDetailProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [isComponentsModalVisible, setComponentsModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<ImageProp | null>(null);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);


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

    const countTotalImages = (images: ImageProp): number => {
        if (!images) return 0; // Handle cases where images might be null or undefined
        return (images.cgi?.length || 0) + (images.img?.length || 0) + (images.dim?.length || 0);
    };

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
            editable: true,
            filter: "agTextColumnFilter",
            cellStyle: {
                fontWeight: "600",
                border: "1px solid #ccc"
            }
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
                    cellStyle: {
                        fontWeight: '500',
                        textAlign: 'start',
                        fontSize: '13px' ,
                        border: "1px solid #ccc"},
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
                    cellStyle: {
                        fontWeight: '500',
                        fontSize: '13px'
                    },
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
                    cellStyle: {
                        fontWeight: '500',
                        fontSize: '13px',
                    },
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
                    cellStyle: {
                        fontWeight: '500',
                        fontSize: '13px'
                    },
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
                    cellStyle: {
                        fontWeight: '500',
                        fontSize: '13px'
                    },
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
                    cellStyle: {
                        fontWeight: '500',
                        fontSize: '13px' },
                },
            ],
            tooltipField: "components",
        },
        {
            headerName: "Images",
            field: "images",
            sortable: true,
            width: 120,
            valueGetter: (params: any) => countTotalImages(params.data.images),
            filter: "agTextColumnFilter",
            cellStyle: { cursor: "pointer", border: "1px solid #ccc",textAlign: "center",fontWeight: '500',
                fontSize: '13px' },
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
                textDecoration: "underline",
                border: "1px solid #ccc"
            },
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
            headerName: "Title",
            field: "title",
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
            headerName: "Description",
            field: "description",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "HTML Description",
            field: "htmlDescription",
            sortable: true,
            width: 150,
            editable: true,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Sale Channel",
            children: [
                {
                    headerName: "EWFDirect",
                    field: "ewfdirect",
                    sortable: true,
                    columnGroupShow: "closed",
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },
                {
                    headerName: "EWFDirect",
                    field: "ewfdirect",
                    sortable: true,
                    columnGroupShow: "open",
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },

                {
                    headerName: "Houston",
                    field: "houstondirect",
                    sortable: true,
                    columnGroupShow: "open",
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },

                {
                    headerName: "EWFMain",
                    field: "ewfmain",
                    sortable: true,
                    columnGroupShow: "open",
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },
                {
                    headerName: "Amazon",
                    field: "amazon",
                    columnGroupShow: "open",
                    sortable: true,
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },
                {
                    headerName: "Cymax",
                    field: "cymax",
                    columnGroupShow: "open",
                    sortable: true,
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },
                {
                    headerName: "Overstock",
                    field: "overstock",
                    columnGroupShow: "open",
                    sortable: true,
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                },
                {
                    headerName: "Wayfair",
                    field: "wayfair",
                    columnGroupShow: "open",
                    sortable: true,
                    width: 150,
                    editable: true,
                    filter: "agTextColumnFilter",
                }
            ],
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
                border: "1px solid #ccc",

            };
        }
    };

    const handleCellValueChanged = async (event: any) => {
        const productProp = event.data;
        const productDetailRequestDto = mapProductDetailPropToRequest(productProp)
        try {
            const updateProduct: ProductDetailProp = await updateProductDetail(productDetailRequestDto);
            event.node.setData(updateProduct);

        } catch (error: any) {
            console.error("Error updating product details:", error);
        }
    };

    const handleCellDoubleClick = (params: any) => {
        // Trigger modal ONLY if the double-clicked column is "Images"
        if (params.colDef.field === "images") {
            setSelectedImages(params.data.images); // Pass the selected cell's images
            setSelectedRowId(params.data.id); // Keep reference to the row ID that needs updating
            setImageModalVisible(true);
        }

        if (params.colDef.field === "components") {
            setSelectedRowId(params.data.id); // Keep reference to the row ID that needs updating
            setImageModalVisible(true);
        }

    };



    const handleModalSave = (updatedImages: ImageProp) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                if (product.id === selectedRowId) {
                    const updatedProduct = { ...product, images: updatedImages };

                    // Map the updated product to the request DTO
                    const productDetailRequestDto = mapProductDetailPropToRequest(updatedProduct);

                    // Make API call to update the product details
                    updateProductDetail(productDetailRequestDto).then(() => {
                        console.log("Product details updated successfully!");
                    });

                    return updatedProduct;
                }
                return product;
            })
        );

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
                    onClick={onExportCSV}>Export
                </button>

                <button
                    onClick={() => setForceUpdate((prev) => prev + 1)}
                    className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    ↻ Refresh
                </button>
            </div>

            <Loader isLoading={loading}>
                {/*Modal Section */}

                <div
                    className="ag-theme-quartz shadow border rounded-xl border-gray-300"
                    style={{height: "800px", width: "100%", marginTop: "20px"}}
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
                        onCellDoubleClicked={handleCellDoubleClick}

                        rowHeight={30}
                    />) : <></>}

                </div>

                <ProductImageModal
                    isVisible={isImageModalVisible}
                    onClose={() => setImageModalVisible(false)}
                    imagesData={selectedImages}
                    onSave={handleModalSave}
                />

            </Loader>
        </>
    )
}
