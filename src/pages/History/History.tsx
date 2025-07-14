import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import React from "react";
import LpnHistory from "./LpnHistory";


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