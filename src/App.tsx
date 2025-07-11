import { Route, BrowserRouter as Router, Routes } from "react-router";
import History from "./pages/History/History"; // Replace with actual path of the History component
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import Ecommerce from "./pages/Dashboard/ECommerce";
import NotFound from "./pages/OtherPage/NotFound";
import ProductDetail from "./pages/Product/ProductDetail";
import Orders from "./pages/Order/Orders";
import NewOrder from "./pages/Order/NewOrder";
import PInventory from "./pages/Inventory/Product/PInventory";
import CInventory from "./pages/Inventory/Components/CInventory";
import Logout from "./pages/AuthPages/Logout";
import ProductSheet from "./pages/Product/ProductSheet";
import Users from "./pages/User/Users";
import Permissions from "./pages/AuthPages/Permissions";
import LPN from "./pages/Inventory/./LPN/LPN";
import NewLPN from "./pages/Inventory/LPN/New/NewLPN";
import SearchBySKU from "./pages/Count&Search/SearchBySKU";

export default function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Ecommerce />} />
            <Route path="/products" element={<ProductSheet />} />
            <Route path="/product/:sku" element={<ProductDetail />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/order/new" element={<NewOrder />} />
            <Route path="/inventory/products" element={<PInventory />} />
            <Route path="/lpn" element={<LPN />} />
            <Route path="/inventory/lpn/add" element={<NewLPN />} />
            <Route path="/components" element={<CInventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/permissions" element={<Permissions />} />

            <Route path="/history" element={<History />} />

            <Route path="/counting/sku" element={<SearchBySKU />} />
          </Route>

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
