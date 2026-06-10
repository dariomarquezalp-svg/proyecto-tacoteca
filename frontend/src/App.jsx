import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

// 🏠 Rutas del Cliente
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage"; 
import SearchResults from "./pages/SearchResults";
import FlashDeals from "./pages/FlashDeals";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Addresses from "./pages/Addresses";
import ProtectedRoute from "./components/ProtectedRoute";

// 👑 COMPONENTES DEL ADMINISTRADOR ACTIVADOS (Solo los que sí existen en tu carpeta)
import AdminLayout from "./pages/admin/AdminLayout"; // 💡 Recuerda renombrarlo a Mayúscula en tu carpeta
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

/* ⏳ ARCHIVOS FANTASMA COMENTADOS TEMPORALMENTE (Descoméntalos cuando los crees en tu carpeta)
import AdminProductForm from "./pages/admin/AdminProductForm"; 
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";
*/

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#121212",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            border: "1px solid rgba(255, 140, 0, 0.2)",
          },
        }}
      />

      <Routes>
        {/* Auth Client */}
        <Route path="/login" element={<Login />} />

        {/* 🏠 RUTAS DE CLIENTES */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductPage />} /> 
          <Route path="search" element={<SearchResults />} />
          <Route path="deals" element={<FlashDeals />} />
          
          {/* Client Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>

        {/* ========================================================= */}
        {/* 👑 TERMINAL ADMINISTRATIVA DE TACOTECA                     */}
        {/* ========================================================= */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* /admin -> Abre el Dashboard */}
          <Route index element={<AdminDashboard />} />
          
          {/* /admin/products -> Abre el inventario del menú */}
          <Route path="products" element={<AdminProducts />} />
          
          {/* ⏳ Rutas inactivas hasta que crees sus archivos correspondientes:
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
          */}
        </Route>

      </Routes>
    </>
  );
};

export default App;