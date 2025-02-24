import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router-dom";

import React, {useEffect, useState} from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

type ProductDetail = {
    sku: string;
    localSku: string;
    Price: number;
    localPrice: number;
    finish: string;
    images: {
        dim: string[];
        img: string[];
    };
};

export default function ProductDetail() {
    const {id} = useParams(); // Retrieve the dynamic `id` from the URL
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get<ProductDetail>(`${process.env.REACT_APP_API_URL}/api/product/search/${id}`);
                const fetchedProduct = response.data;

                // Parse `images` in case it's a JSON string
                if (typeof fetchedProduct.images === "string") {
                    fetchedProduct.images = JSON.parse(fetchedProduct.images);
                }

                setProduct(fetchedProduct);

            } catch (err) {
                setError("Failed to fetch product details.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>No product found.</p>;
    }

    return (
        <>
            <PageMeta
                title={`Product Detail - ${product.sku}`}
                description={`Details for product ${product.sku}`}
            />
            <PageBreadcrumb pageTitle="Product Detail" />
            <div className="container mx-auto">
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <div className="space-y-2">
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Local SKU:</strong> {product.localSku}</p>
                        <p><strong>Price:</strong> ${product.Price?.toFixed(2)}</p>
                        <p><strong>Local Price:</strong> ${product.localPrice?.toFixed(2)}</p>
                        <p><strong>Finish:</strong> {product.finish}</p>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-medium mb-2">Images</h2>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Dimension Images:</h3>
                            <div>
                                <h3 className="text-lg font-semibold">Gallery Images:</h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.images?.img?.length > 0 ? (
                                        product.images.img.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Gallery image ${index + 1}`}
                                                className="h-32 w-auto"
                                                loading="lazy"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        ))
                                    ) : (
                                        <p>No gallery images available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {product.images?.dim?.length > 0 ? (
                                    product.images.dim.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Dimension image ${index + 1}`}
                                            className="h-32 w-auto"
                                            loading="lazy" // Improves performance for multiple images
                                            onError={(e) => (e.currentTarget.style.display = "none")} // Hide broken images
                                        />
                                    ))
                                ) : (
                                    <p>No dimension images available.</p>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
