import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router-dom";

import React, {useEffect, useState} from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";

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
        setLoading(true);
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
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
            }
        }

        if (id) {
            fetchProduct();
        }
    }, [id]);

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
            <Loader isLoading={loading}>
                <div className="container mx-auto px-4 py-8">
                    {/* Outer Card */}
                    <div className="flex flex-col md:flex-row bg-white border rounded-lg shadow-lg p-6 gap-8">
                        {/* Left Section: Product Images */}
                        <div className="flex-none w-full md:w-1/2">
                            <h2 className="text-xl font-medium text-gray-700 mb-4">Product Images</h2>

                            {/* Dimension Images */}
                            {product.images?.dim?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Dimension Images</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {product.images.dim.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Dimension Image ${index + 1}`}
                                                className="rounded-lg shadow h-32 w-auto object-cover"
                                                loading="lazy"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Gallery Images */}
                            {product.images?.img?.length > 0 ? (
                                <div>
                                    <div className="flex flex-wrap gap-4">
                                        {product.images.img.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Gallery Image ${index + 1}`}
                                                className="rounded-lg shadow h-32 w-auto object-cover"
                                                loading="lazy"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No gallery images available.</p>
                            )}
                        </div>

                        {/* Right Section: Product Details */}
                        <div className="flex-grow">
                            <h1 className="text-2xl font-semibold text-gray-700 mb-6">Product Details</h1>
                            <div className="space-y-4">
                                <p>
                                    <span className="font-medium text-gray-600">SKU:</span>{" "}
                                    <span className="text-gray-800">{product.sku}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-600">Local SKU:</span>{" "}
                                    <span className="text-gray-800">{product.localSku}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-600">Price:</span>{" "}
                                    <span className="text-green-600">${product.Price?.toFixed(2)}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-600">Local Price:</span>{" "}
                                    <span className="text-green-600">${product.localPrice?.toFixed(2)}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-600">Finish:</span>{" "}
                                    <span className="text-gray-800">{product.finish}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Loader>
        </>
    );
}
