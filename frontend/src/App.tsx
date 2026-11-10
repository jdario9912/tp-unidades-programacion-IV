import { useEffect } from "react";
import Footer from "@/shared/components/Footer";
import Navbar from "@/shared/components/Navbar";
import MainLayout from "@/shared/components/MainLayout";
import AppRouter from "@/routes/AppRouter";
import { useCheckSession } from "@/features/auth";

function App() {
  const checkSession = useCheckSession();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="text-letters">
      <Navbar />
      <MainLayout>
        <AppRouter />
      </MainLayout>
      <Footer />
    </div>
  );
}

export default App;
