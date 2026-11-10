import { useEffect } from "react";
import { useCheckAuth } from "@/features/auth";
import AppRouter from "@/routes/AppRouter";
import Toast from "@/shared/components/Toast";

function App() {
  const checkAuth = useCheckAuth();

  // la sesión se recupera de la cookie HttpOnly al iniciar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}

export default App;
