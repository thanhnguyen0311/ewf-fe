import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Ecommerce from "./pages/Dashboard/ECommerce";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import ProductDetail from "./pages/Product/ProductDetail";
import Orders from "./pages/Order/Orders";
import NewOrder from "./pages/Order/NewOrder";
import PInventory from "./pages/Inventory/Product/PInventory";
import CInventory from "./pages/Inventory/Components/CInventory";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />
            <Route path="/products" element={<UserProfiles />} />
            <Route path="/product/:sku" element={<ProductDetail />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/order/new" element={<NewOrder />} />
            <Route path="/inventory/products" element={<PInventory />} />
            <Route path="/inventory/components" element={<CInventory />} />

          </Route>

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
