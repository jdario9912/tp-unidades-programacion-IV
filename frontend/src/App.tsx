import { useEffect } from "react";
import { useCheckSession } from "@/features/auth";
import AppRouter from "@/routes/AppRouter";
import Toast from "@/shared/components/Toast";

function App() {
  const checkSession = useCheckSession();

  // única llamada al servidor en un useEffect: confirma la sesión de la cookie HttpOnly
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}

export default App;
