import React, { useState } from 'react';
import { ProductService } from '../../services/products.services';
import './Products.css';
import {Helmet} from "react-helmet";

const Products = () => {
    const [product, setProduct] = useState(null);
    const [skuInput, setSkuInput] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setSkuInput(e.target.value);
    };
    const getPageTitle = () => {
        if (product) {
            return `${product.name || product.sku} - East West Furniture`;
        }
        return 'Product Search - East West Furniture';
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!skuInput.trim()) {
            setError('Please enter a SKU');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await ProductService.getProductBySku(skuInput);
            console.group('Product Data');
            console.log('Full Product:', data);
            console.log('Product ID:', data.id);
            setProduct(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching product');
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const renderImages = (imagesString) => {
        if (!imagesString) return <p>No images available</p>;

        try {
            const imagesData = JSON.parse(imagesString);
            const { img = [], dim = [] } = imagesData;

            return (
                <div className="images-section">
                    {img.length > 0 && (
                        <div className="image-category">
                            <h3>Product Images</h3>
                            <div className="images-grid">
                                {img.map((imageUrl, index) => (
                                    <div key={`img-${index}`} className="image-container">
                                        <img
                                            src={imageUrl}
                                            alt={`Product ${index + 1}`}
                                            className="product-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {dim.length > 0 && (
                        <div className="image-category">
                            <h3>Dimension Images</h3>
                            <div className="images-grid">
                                {dim.map((dimUrl, index) => (
                                    <div key={`dim-${index}`} className="image-container">
                                        <img
                                            src={dimUrl}
                                            alt={`Dimension ${index + 1}`}
                                            className="product-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        } catch (err) {
            console.error('Error parsing images:', err);
            return <p>Error displaying images</p>;
        }
    };

    return (
        <div className="products-container">
            <Helmet>
                <title>{getPageTitle()}</title>
            </Helmet>

            <h1>Product Search</h1>

            <div className="search-section">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={skuInput}
                        onChange={handleInputChange}
                        placeholder="Enter SKU"
                        className="sku-input"
                    />
                    <button
                        type="submit"
                        className="search-button"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}

            {product && (
                <div className="product-details">
                    <h2>Product Details</h2>
                    <div className="product-info">
                        <p><strong>ID:</strong> {product.id}</p>
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Price:</strong> {product.localProduct.price}</p>
                        <div className="product-images">
                            {renderImages(product.images)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;