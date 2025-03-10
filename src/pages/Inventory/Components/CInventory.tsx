import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {FC, useEffect, useState} from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import axios from "axios";



type ComponentProp = {
    id: number;
    sku: string;
    manufacturer: string;
    finish: string;
    name: string;
    discontinue: boolean;
    category: string;
    inventory: number;
    images: {
        dim: string[];
        img: string[];
    };
};

const columnDefs: ColDef<ComponentProp>[] = [
    { headerName: "", field: "manufacturer", sortable: true, width: 30,
        // cellStyle: (params: any)=> {
        //     return {
        //         background: params.value === "SpecificValue" ? "" : "",
        //         color: '#d01edc',
        //         fontWeight: "bold",
        //     }
        // }
        cellStyle: (params: any) => {
            const styleMap: Record<string, { color: string; backgroundColor: string; fontWeight: string}> = {
                TT: { color: "#d01edc", backgroundColor: "#B7E1CD" , fontWeight: "bold"},
                TB: { color: "white", backgroundColor: "#E06666" , fontWeight: "bold"},
                CN: { color: "#d01edc", backgroundColor: "white" , fontWeight: "bold"},
                HD: { color: "#d01edc", backgroundColor: "#FFD966" , fontWeight: "bold"},
                LT: { color: "yellow", backgroundColor: "#D5A6BD" , fontWeight: "bold"},
                HU: { color: "#d01edc", backgroundColor: "white" , fontWeight: "bold"},
                AM: { color: "#d01edc", backgroundColor: "#B6D7A8" , fontWeight: "bold"},
                HG: { color: "red", backgroundColor: "#C9DAF8" , fontWeight: "bold"},
                Default: { color: "#d01edc", backgroundColor: "white" , fontWeight: "bold"}, // Default style
            };
            return styleMap[params.value] || styleMap["Default"];
        },

    },
    { headerName: "SKU", field: "sku", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true },
    { headerName: "Category", field: "category", sortable: true },
    {
        headerName: "Inventory",
        field: "inventory",
        sortable: true,
        filter: "agNumberColumnFilter",
    },
    {
        headerName: "Discontinue",
        field: "discontinue",
        cellRenderer: (params: any) => {
            return (
                <input
                    type="checkbox"
                    checked={params.value}
                    disabled={true}
                />
            );
        },
        sortable: true,
        filter: true,
    },
    { headerName: "Finish", field: "finish", sortable: true }

];


const CInventory: FC = () => {
    const [components, setComponents] = useState<ComponentProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [gridApi, setGridApi] = useState<any>(null);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ComponentProp[]>(
                    `${process.env.REACT_APP_API_URL}/api/inventory/components`
                );
                setComponents(response.data); // Populate the components state with API response
            } catch (error) {
                setError("Failed to fetch components. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, []);


 return (
     <>
         <PageMeta
             title="Component Inventory | East West Furniture"
             description=""
         />
         <PageBreadcrumb pageTitle="Component Inventory"/>
         <div
             className="ag-theme-quartz"
             style={{ height: "800px", width: "100%", marginTop: "20px" }}
         >
         <AgGridReact
                 rowData={components} // Pass fetched data to the grid
                 columnDefs={columnDefs} // Define columns
                 defaultColDef={{
                     flex: 1, // Columns take equal space unless resized
                     minWidth: 50,
                     resizable: true, // Allow resizing
                     filter: true, // Enable filtering
                 }}
                 getRowStyle={(params) => {
                     return {
                         backgroundColor: params.data && params.data.id !== undefined && params.data.id % 2 === 1 ? "#e4f7f0" : "white",
                     };
                 }}

                 rowHeight={30}
         />
         </div>

     </>
 )
}

export default CInventory;
