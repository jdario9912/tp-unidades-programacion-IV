import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import MainLayout from "./MainLayout";
import Navbar from "./Navbar";

// ruta de layout: todas las páginas se renderizan en el Outlet
const AppLayout = () => (
  <>
    <Navbar />
    <MainLayout>
      <Outlet />
    </MainLayout>
    <Footer />
  </>
);

export default AppLayout;
