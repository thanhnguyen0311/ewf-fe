import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import Loader from "../../UiElements/Loader/Loader";
import Button from "../../../components/ui/button/Button";
import {AgGridReact} from "ag-grid-react";
import { ColDef, ColGroupDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-theme-balham.css";
import {useNavigate} from "react-router";
import {LPNProp} from "../../../interfaces/LPN";
import {getAllLpn} from "../../../api/LpnApiService";

import "./LPN.css"
import PutAwayLPN from "./PutAway/PutAwayLPN";

export default function LPN() {
    const gridRef = useRef<AgGridReact>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [lpns, setLpns] = useState<LPNProp[]>([]);
    const [showPutAwayModal, setShowPutAwayModal] = useState(false);


    const columnDefs: (ColDef | ColGroupDef)[] = [
        {
            headerName: "",
            width: 50,

        },
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
            headerName: "Location",
            field: "bayCode",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
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
            headerName: "Status",
            field: "status",
            sortable: true,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
            cellStyle: (params: any) => {
                return {
                    fontSize: "14px",
                    fontWeight: "700",
                    padding: "2px",
                    marginLeft: "15px",
                    color: params.value === "active" ? "#009900" : "#ff0000",
                };
            }
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
            headerName: "Date",
            field: "date",
            sortable: true,
            width: 150,
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
                padding: "2px",
                marginLeft: "15px",
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllLpn(); // Call API to fetch LPN data
                setLpns(data); // Set table row data
            } catch (error) {
                console.error("Error fetching LPN data: ", error);
            } finally {
                setLoading(false); // Hide loader
            }
        };

        fetchData();
    }, [showPutAwayModal]); // Empty dependency array ensures this runs once on mount


    return (
        <>
            <PageMeta
                title="LPN Management | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="LPN Management"/>

            <div className="flex justify-start mb-4">
                <Button size="sm"
                        variant="primary"
                        className={"mr-2.5 flex items-center"}
                        onClick={() => navigate("/inventory/lpn/add")}
                >
                    New LPN
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowPutAwayModal(true)}
                    className={"mr-2.5 flex items-center"}
                >
                    Put away
                </Button>

                {/*<Button size="sm"*/}
                {/*        variant="primary"*/}
                {/*        className={"mr-2.5 flex items-center"}*/}
                {/*>*/}
                {/*    History*/}
                {/*</Button>*/}
            </div>

            <Loader isLoading={loading}>
                <div
                    className="ag-theme-balham shadow rounded-xl "
                    style={{height: "700px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (
                        <AgGridReact
                        ref={gridRef}
                        rowData={lpns}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        headerHeight={40}
                        rowHeight={32}
                    />) : <></>}

                </div>
            </Loader>

            <PutAwayLPN
                visible={showPutAwayModal}
                onCancel={() => setShowPutAwayModal(false)}
                lpnProps={lpns}
            />

        </>
    )
}