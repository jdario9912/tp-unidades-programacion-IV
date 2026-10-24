import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import RoutesApp from "./components/RoutesApp";

const queryClient = new QueryClient();

function App() {
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
