import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Observances from "@/pages/Observances";
import Membership from "@/pages/Membership";
import Shop from "@/pages/Shop";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
};

const Shell = () => {
  useLenis();
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/observances" element={<Observances />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Shell />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
