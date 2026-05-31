import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Home from "./pages/Home.jsx";
import Orders from "./pages/Orders.jsx";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-full">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <Cart />
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <Checkout />
              </PageTransition>
            }
          />
          <Route
            path="/orders"
            element={
              <PageTransition>
                <Orders />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                  <div className="font-display text-3xl font-bold text-ink-900">Page not found</div>
                  <p className="mt-2 text-sm text-slate-600">Check the URL or go back to the menu.</p>
                </div>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
