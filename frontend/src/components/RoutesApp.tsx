import { Navigate, Route, Routes } from "react-router-dom";
import Categorias from "../pages/Categorias";
import Ingredientes from "../pages/Ingredientes";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import Productos from "../pages/Productos";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "./auth/ProtectedRoute";

const RoutesApp = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    {/* todos los recursos del backend requieren sesión */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Navigate to="categorias" />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/ingredientes" element={<Ingredientes />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesApp;
