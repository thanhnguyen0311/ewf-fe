import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import React, {useState} from "react";
import LpnHistory from "./LpnHistory";
import {set} from "ag-grid-enterprise/dist/types/src/charts/chartComp/utils/object";

export default function History() {


    return (
        <>
            <PageMeta
                title="History | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="History activity"/>

            <div className="flex justify-start mb-4">

            </div>

            <LpnHistory />

        </>
    )
}