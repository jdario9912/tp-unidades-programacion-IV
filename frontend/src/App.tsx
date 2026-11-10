import { useEffect } from "react";
import { useCheckSession } from "@/features/auth";
import AppRouter from "@/routes/AppRouter";

function App() {
  const checkSession = useCheckSession();

  // la sesión se recupera de la cookie HttpOnly al iniciar
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <AppRouter />;
}

export default App;
