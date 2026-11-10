import { Navigate, Route, Routes } from "react-router-dom";
import { Categorias } from "@/features/categories";
import { Ingredientes } from "@/features/ingredients";
import { Productos } from "@/features/products";
import { AdminUsersPage, LoginPage, RegisterPage } from "@/features/auth";
import AppLayout from "@/shared/components/AppLayout";
import NotFound from "@/shared/components/NotFound";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* todos los recursos del backend requieren sesión */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<Categorias />} />
        <Route path="/products" element={<Productos />} />
        <Route path="/ingredients" element={<Ingredientes />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRouter;
