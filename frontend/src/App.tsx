import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/shared/components/Footer";
import Navbar from "@/shared/components/Navbar";
import MainLayout from "@/shared/components/MainLayout";
import RoutesApp from "@/routes/AppRouter";
import { ApiError, setUnauthorizedHandler } from "@/shared/api/handle-errors";
import { useAuthStore } from "@/features/auth";
import { useCheckSession } from "@/features/auth";

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
  const checkSession = useCheckSession();

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
