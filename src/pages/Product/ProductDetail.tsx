import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router-dom";

import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../UiElements/Loader/Loader";
import ImageModal from "../UiElements/Modals";
import {Link} from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../components/ui/table";
import {componentsProductContainerTableColumns} from "../../config/tableColumns";

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
    const {sku} = useParams(); // Retrieve the dynamic `id` from the URL
    const [product, setProduct] = useState<ProductProp | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const response = await axios.get<ProductProp>(`${process.env.REACT_APP_API_URL}/api/product/${sku}`);
                const fetchedProduct = response.data;

                setProduct(fetchedProduct);

            } catch (err) {
                setError("Failed to fetch product details.");
            } finally {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);

            }
        }

        if (sku) {
            fetchProduct();
        }
    }, [sku]);

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


            <div style={{ marginBottom: '20px' }}
                 className="flex flex-wrap md:flex-nowrap items-start gap-8 p-6 shadow  dark:text-white/90 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

                <div className="w-full md:w-1/2">
                    <Link  to={`/product/${product.sku}`}
                           className="text-gray-500  font-bold text-theme-xl p-2 text-start text-theme-md dark:text-gray-400 hover:text-warning-500">{product.sku}
                    </Link>
                    <div className="flex flex-wrap mt-5 gap-4">
                        {product.images?.img?.length > 0 && (
                            <div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="cursor-pointer">
                                        <img
                                            src={product.images.img[0]}
                                            alt="Product image"
                                            className="h-48 w-auto rounded shadow-sm"
                                            onClick={() => toggleZoom(product.images.img[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {product.images?.dim?.length > 0 && (
                            <div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="cursor-pointer">
                                        <img
                                            src={product.images.dim[0]}
                                            alt="Product image"
                                            className="h-48 w-auto rounded shadow-sm"
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

                <div className="w-full md:w-2/3">
                    <div className="space-y-2 text-gray-500 text-start text-theme-md dark:text-gray-400">
                        <p><strong>Local SKU:</strong> {product.localSku}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Inventory:</strong> {product.inventory}</p>
                        <p><strong>Finish:</strong> {product.finish || "N/A"}</p>
                    </div>

                    {product.components?.length > 0 && (
                        <Table className={'mt-5 border-2 border-gray-200 dark:border-gray-800'}>
                            <TableHeader columns={componentsProductContainerTableColumns}/>
                            <TableBody>
                                {product.components?.map((component) => (
                                    <TableRow key={component.id}>
                                        <TableCell className="px-2 py-2 sm:px-4 text-start">
                                            <div className="flex items-center gap-3 ">
                                                <div className="w-15 h-15 rounded-full cursor-pointer" style={{alignContent: "center"}}>
                                                    {component.images ? <img src={component.images.img[0]} alt={component.sku}
                                                                             onClick={() => toggleZoom(component.images.img[0])}/> : ""}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell
                                            className={`px-4 py-3 font-bold text-start text-theme-xs dark:text-gray-400 text-gray-500`}>
                                            {component.sku}
                                        </TableCell>

                                        <TableCell
                                            className={`px-4 py-3 font-bold text-start text-theme-xs dark:text-gray-400 text-gray-500`}>
                                            {component.finish}
                                        </TableCell>

                                        <TableCell
                                            className={`px-4 py-3 font-bold text-start text-theme-xs dark:text-gray-400 text-gray-500`}>
                                            {component.inventory}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                </div>

            </div>
        </>
    );
}

