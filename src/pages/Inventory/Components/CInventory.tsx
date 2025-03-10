import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useState} from "react";
import { AgGridReact } from 'ag-grid-react';


export default function CInventory() {

    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    const [colDefs, setColDefs] = useState<{ field: keyof { make: string; model: string; price: number; electric: boolean } }[]>([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);

 return (
     <>
         <PageMeta
             title="Component Inventory | East West Furniture"
             description=""
         />
         <PageBreadcrumb pageTitle="Component Inventory"/>
         <div style={{ height: 500 }}>
             <AgGridReact
                 rowData={rowData}
                 columnDefs={colDefs}
             />
         </div>
     </>
 )
}