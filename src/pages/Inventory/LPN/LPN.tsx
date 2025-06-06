import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useRef, useState} from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import Loader from "../../UiElements/Loader/Loader";
import Button from "../../../components/ui/button/Button";
import {AgGridReact} from "ag-grid-react";
import { ColDef, ColGroupDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-theme-balham.css";
import {useNavigate} from "react-router";


export default function LPN() {
    const gridRef = useRef<AgGridReact>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    const rowData = [
        { orderId: 101, customer: "Alice", date: "2025-06-06", status: "Pending", total: 120 },
        { orderId: 102, customer: "Bob", date: "2025-06-05", status: "Shipped", total: 80 },
    ];


    const columnDefs: (ColDef | ColGroupDef)[] = [

        {
            headerName: "RFID Tag ID",
            field: "tagID",
            sortable: false,
            width: 250,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: false,
            width: 220,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Qty",
            field: "quantity",
            sortable: false,
            width: 100,
            editable: false,
        },
        {
            headerName: "#Container",
            field: "containerNumber",
            sortable: true,
            width: 250,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Location",
            field: "bayCode",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Zone",
            field: "zone",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Status",
            field: "status",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Date",
            field: "date",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "Created By",
            field: "createdBy",
            sortable: true,
            width: 200,
            editable: false,
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
            };
        }
    };

    return (
        <>
            <PageMeta
                title="LPN Management | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="LPN Management"/>

            <div className="flex justify-start mb-4">
                <Button size="sm"
                        variant="outline"
                        className={"mr-1.5 flex items-center"}
                        onClick={() => navigate("/inventory/lpn/add")}
                >
                    Add
                </Button>
                <Button size="sm"
                        variant="outline"
                        className={"mx-1.5 flex items-center"}
                >
                    History
                </Button>
            </div>

            <Loader isLoading={loading}>
                <div
                    className="ag-theme-balham shadow border rounded-xl border-gray-300"
                    style={{height: "700px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        headerHeight={40}
                        sideBar={true}
                        rowHeight={30}
                    />) : <></>}

                </div>
            </Loader>
        </>
    )
}