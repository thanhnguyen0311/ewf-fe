import { Routes, Route, Navigate } from 'react-router-dom';
import Products from '../pages/Products/Products';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Redirect from root to products */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Products page */}
            <Route path="/products" element={<Products />} />

            {/* Add other routes here */}
        </Routes>
    );
};

export default AppRoutes;