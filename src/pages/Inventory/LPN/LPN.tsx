import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from 'react';
import 'flatpickr/dist/flatpickr.min.css';
import Loader from "../../UiElements/Loader/Loader";
import Button from "../../../components/ui/button/Button";
import {AgGridReact} from "ag-grid-react";
import {ColDef, ColGroupDef} from 'ag-grid-community';
import "ag-grid-community/styles/ag-theme-balham.css";
import {useNavigate} from "react-router";
import {LPNProp} from "../../../interfaces/LPN";
import {getAllLpn} from "../../../api/LpnApiService";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faPlus} from "@fortawesome/free-solid-svg-icons";


import "./LPN.css"
import {useNotification} from "../../../context/NotificationContext";
import FindLPN from "./Find/FindLPN";
import {useSidebar} from "../../../context/SidebarContext";

export default function LPN() {
    const {isMobile} = useSidebar();
    const gridRef = useRef<AgGridReact>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [lpns, setLpns] = useState<LPNProp[]>([]);
    const {sendNotification} = useNotification();
    const [mode, setMode] = useState<"" | "find" | "putaway" | "edit" | "breakdown">("");


    const columnDefs: (ColDef | ColGroupDef)[] = [
        {
            headerName: "Tag ID",
            field: "tagID",
            sortable: false,
            width: 110,
            editable: true,
            filter: "agTextColumnFilter",
            valueFormatter: (params) => {
                const tagId = params.value || ""; // Ensure the value exists
                return "...." + tagId.slice(-5); // Display only the last three characters
            },
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: false,
            width: 150,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "QTY",
            field: "quantity",
            sortable: false,
            width: 60,
            editable: false,
        },
        {
            headerName: "BAY",
            field: "bayCode",
            sortable: true,
            width: 80,
            editable: false,
            filter: "agTextColumnFilter",
        },
        {
            headerName: "STATUS",
            field: "status",
            sortable: true,
            width: 100,
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
            headerName: "#Container",
            field: "containerNumber",
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
            setLoading(true);
            try {
                const data = await getAllLpn(); // Call API to fetch LPN data
                setLpns(data); // Set table row data
            } catch (error) {
                console.error("Error fetching LPN data: ", error);
                sendNotification(
                    "error",
                    "Error fetching LPN data",
                    error instanceof Error ? error.message : String(error)
                );
            } finally {
                setLoading(false); // Hide loader
            }
        };

        if (mode === "") {
            fetchData(); // Fetch data only when mode changes to an empty string
        }
    }, [mode]); // Trigger when `mode` changes



    return (
        <>
            <PageMeta
                title="LPN Management | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="LPN Management"/>

                {
                    isMobile ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    aria-label="Clear search"
                                    className="fixed bottom-20 z-10 right-4 w-12 h-12 flex items-center justify-center shadow-lg bg-orange-400 text-white hover:bg-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    onClick={() => setMode("find")} // Replace with your search function or navigation
                                >
                                    <FontAwesomeIcon icon={faSearch} className="text-xl"/>
                                </Button>

                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="fixed bottom-4 z-1 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-orange-400 text-white hover:bg-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    onClick={() => navigate("/inventory/lpn/add")}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-2xl"/>
                                </Button>
                            </>
                        ) :
                        <div className="flex justify-start mb-4">
                            <Button size="sm"
                                    variant="primary"
                                    className={"mr-5 flex items-center"}
                                    onClick={() => navigate("/inventory/lpn/add")}
                            >
                                New LPN
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => setMode("find")}
                                className={"mr-5 flex items-center"}
                            >
                                Put away
                            </Button>

                            <Button size="sm"
                                    variant="primary"
                                    onClick={() => setMode("find")}
                                    className={"mr-5 flex items-center"}
                            >
                                Breakdown
                            </Button>

                        </div>
                }


            <Loader isLoading={loading}>
                <div
                    className="ag-theme-balham shadow rounded-xl"
                    style={{height: "550px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (
                        <AgGridReact
                            ref={gridRef}
                            suppressMovableColumns={true}
                            rowData={lpns}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            headerHeight={40}
                            rowHeight={32}
                        />) : <></>}

                </div>
            </Loader>

            <FindLPN
                onCancel={() => setMode("")}
                mode={mode}
                setMode={setMode}
            />

        </>
    )
}