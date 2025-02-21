import PageMeta from "../../components/common/PageMeta";
import { useParams, Link } from "react-router-dom";

import {useEffect, useState} from "react";
import axios from "axios";

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
                const response = await axios.get<ProductDetail>(`http://192.168.10.27:8080/api/product/search/${id}`);
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
            <div className="container mx-auto">
                <Link to="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">
                    Back to dashboard
                </Link>
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <h1 className="text-2xl font-bold mb-4">Product Details</h1>
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
