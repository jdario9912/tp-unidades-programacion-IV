import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <main className="container mx-auto p-4">
        <Navbar />
        <Footer />
      </main>
    </div>
  );
}

export default App;
