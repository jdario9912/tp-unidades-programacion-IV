import { Route, Routes } from "react-router-dom";
import { AdminCategoriasPage } from "@/features/categorias";
import { AdminProductosPage, CatalogoPage } from "@/features/productos";
import {
  AdminPedidosPage,
  AdminResumenPage,
  CarritoPage,
  CheckoutPage,
  MisPedidosPage,
} from "@/features/pedidos";
import { AdminUsuariosPage } from "@/features/usuarios";
import { LoginPage, RegisterPage, UnauthorizedPage } from "@/features/auth";
import AppLayout from "@/shared/layout/AppLayout";
import NotFound from "@/shared/components/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<CatalogoPage />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* cualquier usuario con sesión, también el admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mis-pedidos" element={<MisPedidosPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/resumen" element={<AdminResumenPage />} />
        <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
        <Route path="/admin/productos" element={<AdminProductosPage />} />
        <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
        <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRouter;
