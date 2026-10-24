import { Navigate, Route, Routes } from "react-router-dom";
import Categorias from "../pages/Categorias";
import NotFound from "../pages/NotFound";
import Productos from "../pages/Productos";

const RoutesApp = () => (
  <Routes>
    <Route path="/" element={<Navigate to="categorias" />} />
    <Route path="/categorias" element={<Categorias />} />
    <Route path="/productos" element={<Productos />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesApp;
