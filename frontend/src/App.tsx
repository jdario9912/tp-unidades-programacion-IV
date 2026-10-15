import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Categorias from "./pages/Categorias";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <main className="container mx-auto p-4">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Routes>
            <Route path="/categorias" element={<Categorias />} />
          </Routes>
          <Footer />
        </QueryClientProvider>
      </main>
    </div>
  );
}

export default App;
