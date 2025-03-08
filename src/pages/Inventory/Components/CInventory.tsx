import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { ComponentInventoryRowData } from "../../../config/tableColumns";

export default function CInventory() {
    const [rowData, setRowData] = useState<ComponentInventoryRowData[]>([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Tesla", model: "Model 3", price: 46990, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Camry", price: 24500, electric: false },
    ]);

    const colDefs: ColDef<ComponentInventoryRowData>[] = [
        {
            field: "make",
            rowGroup: true, // Group rows by this field
            hide: true, // Hide the column; grouping will handle its display
        },
        { field: "model", headerName: "Model" },
        { field: "price", headerName: "Price", sortable: true },
        {
            field: "electric",
            headerName: "Electric",
            cellRenderer: (params: { value: boolean }) => (params.value ? "Yes" : "No"),
        },
    ];

    return (
        <>
            <PageMeta
                title="Component Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Component Inventory" />
            <div style={{ height: 300, width: "100%" }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    groupDisplayType="groupRows" // Defines how groups are displayed
                    animateRows={true} // Enables smooth row animations
                />
            </div>
        </>
    );
}