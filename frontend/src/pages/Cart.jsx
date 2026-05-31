import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CartItem from "../components/CartItem.jsx";
import BillSummary from "../components/BillSummary.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, subtotal, delivery, grandTotal, freeDeliveryThreshold } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">Your cart</h1>
          <p className="mt-1 text-sm text-slate-600">Review items before checkout.</p>
        </div>
        <Link
          to="/"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          ← Back to menu
        </Link>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"
        >
          <div className="text-4xl">🍽️</div>
          <div className="mt-3 font-display text-xl font-bold text-ink-900">Cart is empty</div>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Add something tasty from the home page. Quantities can be adjusted here anytime.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600"
          >
            Browse menu
          </Link>
        </motion.div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <ul className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.foodId} item={item} />
              ))}
            </AnimatePresence>
          </ul>

          <div className="space-y-4">
            <BillSummary
              subtotal={subtotal}
              delivery={delivery}
              grandTotal={grandTotal}
              freeDeliveryThreshold={freeDeliveryThreshold}
            />
            <Link
              to="/checkout"
              className="block w-full rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:brightness-105"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
