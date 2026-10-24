import { Navigate, Route, Routes } from "react-router-dom";
import Categorias from "../pages/Categorias";
import NotFound from "../pages/NotFound";

const RoutesApp = () => (
  <Routes>
    <Route path="/" element={<Navigate to="categorias" />} />
    <Route path="/categorias" element={<Categorias />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesApp;
