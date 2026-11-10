import { useEffect } from "react";
import { useCheckAuth } from "@/features/auth";
import AppRouter from "@/routes/AppRouter";

function App() {
  const checkAuth = useCheckAuth();

  // la sesión se recupera de la cookie HttpOnly al iniciar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
}

export default App;
