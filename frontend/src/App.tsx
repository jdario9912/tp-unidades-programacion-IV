import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import RoutesApp from "./components/RoutesApp";
import { ApiError, setUnauthorizedHandler } from "./api/handle-errors";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // los errores 4xx no se resuelven reintentando
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500)
          return false;
        return failureCount < 2;
      },
    },
  },
});

// ante un 401 se limpia la sesión local; ProtectedRoute redirige al login
setUnauthorizedHandler(() => {
  useAuthStore.setState({ usuario: null });
  queryClient.clear();
});

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-letters">
        <Navbar />
        <MainLayout>
          <RoutesApp />
        </MainLayout>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
