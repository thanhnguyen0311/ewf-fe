import api from './api/axios';
import {API_CONFIG} from '../config/api.config';

export const ProductService = {
    getProductBySku: async (sku) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${sku}`);
            return response.data;  // Axios already parses JSON, just use response.data
        } catch (error) {
            throw error;
        }
    },
    // ... other methods
};