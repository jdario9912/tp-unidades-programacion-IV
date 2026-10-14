import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Categorias from "./pages/Categorias";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <main className="container mx-auto p-4">
        <Navbar />
        <Routes>
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default App;
