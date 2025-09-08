import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Layout = () => {
  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar siempre arriba */}
        <Navbar />

        {/* Contenido principal que empuja el footer */}
        <main className="flex-grow-1">
          <Outlet />
        </main>

        {/* Footer siempre abajo */}
        <Footer />
      </div>
    </ScrollToTop>
  );
};