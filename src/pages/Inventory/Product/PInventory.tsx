import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from "react";
import {getComponents, productSearch} from "../../../api/apiService";
import {AgGridReact} from "ag-grid-react";


export type ProductProp = {
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
    salesReport: number;
    onPO: number;
    inStock: number;
    inTransit: number;
    rating: number;
    toShip: number;
    stockVN: number;
    inProduction: number;
    stockStatus: string;
    toBeShipped: number;
};

export default function PInventory() {
    const [products, setProducts] = useState<ProductProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const fetchComponents = async () => {
        try {
            setLoading(true);
            const sortedComponents = await getComponents();
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch components. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComponents();
    }, [forceUpdate]);


    return (
        <>
            <PageMeta
                title="Product Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Product Inventory"/>

        </>
    )
}

