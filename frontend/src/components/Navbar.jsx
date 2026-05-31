import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";

const linkClass = ({ isActive }) =>
  [
    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-white text-ink-900 shadow-sm" : "text-slate-600 hover:text-ink-900",
  ].join(" ");

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/25"
          >
            <span className="font-display text-sm font-bold">F</span>
          </motion.div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-ink-900">FoodDel</div>
            <div className="text-xs text-slate-500">Fresh & fast</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-slate-100/80 p-1 sm:flex">
          <NavLink to="/" className={linkClass} end>
            Menu
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            Checkout
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm transition hover:border-slate-300"
          >
            <motion.span whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2">
              <span aria-hidden>🛒</span>
              <span className="hidden sm:inline">Cart</span>
            </motion.span>
            {count > 0 ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white"
              >
                {count > 99 ? "99+" : count}
              </motion.span>
            ) : null}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:hidden">
        <NavLink to="/" className={linkClass} end>
          Menu
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart
        </NavLink>
        <NavLink to="/checkout" className={linkClass}>
          Checkout
        </NavLink>
        <NavLink to="/orders" className={linkClass}>
          Orders
        </NavLink>
      </div>
    </header>
  );
}
