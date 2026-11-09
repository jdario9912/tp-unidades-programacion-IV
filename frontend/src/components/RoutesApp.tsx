import { Navigate, Route, Routes } from "react-router-dom";
import Categorias from "../pages/Categorias";
import Ingredientes from "../pages/Ingredientes";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import Productos from "../pages/Productos";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import Usuarios from "../pages/Usuarios";
import ProtectedRoute from "./auth/ProtectedRoute";

const RoutesApp = () => (
  <Routes>
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
      <Route path="/admin/users" element={<Usuarios />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesApp;
