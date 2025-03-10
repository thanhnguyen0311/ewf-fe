import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router-dom";

import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import ImageModal from "../UiElements/Modals";
import {Link} from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";

type ComponentProps = {
    id: number;
    sku: string;
    inventory: number;
    finish: string;
    category: string;
    images: {
        dim: string[];
        img: string[];
    };
};

type ProductProp = {
    id: number;
    sku: string;
    localSku: string;
    // localPrice: number;
    finish: string;
    category: string;
    inventory: number;
    images: {
        dim: string[];
        img: string[];
    };
    components: ComponentProps[];
    subProducts: ProductProp[];
};

export default function ProductDetail() {
    const {id} = useParams(); // Retrieve the dynamic `id` from the URL
    const [product, setProduct] = useState<ProductProp | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const response = await axios.get<ProductProp>(`${process.env.REACT_APP_API_URL}/api/product/search/${id}`);
                const fetchedProduct = response.data;

                console.log(fetchedProduct);
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
                <ComponentCard title="">

                    <ProductContainer product={product}/>

                    {product.subProducts?.length > 0 && (
                        <>
                        {product.subProducts.map((subProduct) => (
                            <ProductContainer product={subProduct} />
                        ))}
                        </>
                    )}
                </ComponentCard>

            </Loader>
        </>
    );
}

interface ProductContainerProp {
    product : ProductProp;
}

const ProductContainer: FC<ProductContainerProp> = ({ product}) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const toggleZoom = (imageUrl?: string) => {
        if (imageUrl) setZoomImage(imageUrl);
        setIsZoomed(!isZoomed);
    };

    return (<>
            <Link to={`/product/${product.id}`} className="text-xl  font-bold ">{product.sku}</Link>
            {/* Inline Content */}
            <div className="flex flex-wrap md:flex-nowrap items-start mt-2 gap-8 p-6 shadow dark:text-white/90 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Left Section: Product Images */}
                <div className="w-full md:w-1/2">
                    <div className="flex flex-wrap gap-4">
                        {product.images?.img?.length > 0 && (
                            <div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="cursor-pointer">
                                        <img
                                            src={product.images.img[0]}
                                            alt="Product image"
                                            className="h-48 w-auto rounded shadow-sm"
                                            loading="lazy"
                                            onClick={() => toggleZoom(product.images.img[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dimension Images */}
                        {product.images?.dim?.length > 0 && (
                            <div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="cursor-pointer">
                                        <img
                                            src={product.images.dim[0]}
                                            alt="Product image"
                                            className="h-48 w-auto rounded shadow-sm"
                                            loading="lazy"
                                            onClick={() => toggleZoom(product.images.dim[0])} // Open zoom modal
                                        />
                                    </div>


                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isZoomed && zoomImage && (
                    <ImageModal image={zoomImage} name={product.sku} toggleZoom={toggleZoom} />
                )}


                {/* Right Section: Product Details */}
                <div className="w-full md:w-1/2">
                    <div className="space-y-2 text-sm">
                        <p><strong>Local SKU:</strong> {product.localSku}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Inventory:</strong> {product.inventory}</p>
                        <p><strong>Finish:</strong> {product.finish || "N/A"}</p>
                    </div>
                </div>
                {/* COMPONENT TABLE SECTION */}

            </div>
        </>
    );
}

