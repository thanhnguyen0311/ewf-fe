import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import {AgGridReact} from "ag-grid-react";
import React, {useState} from "react";

export default function History() {
    const [loading, setLoading] = useState<boolean>(true);


    return (
        <>
            <PageMeta
                title="History | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="LPN Management"/>

            <div className="flex justify-start mb-4">

            </div>

            <Loader isLoading={loading}>

            </Loader>

        </>
    )
}