import React, { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";

export default function Permissions() {
    return (
        <div>
            <PageMeta
                title="User Management | East West Furniture "
                description="User Management"
            />
            <PageBreadcrumb pageTitle="User Management" />
            <div className="space-y-6">
                <ComponentCard title="Bar Chart 1">
                    <BarChartOne />
                </ComponentCard>
            </div>
        </div>
    );
}