import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BillSummary from "../components/BillSummary.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getOrCreateUserId } from "../lib/userId.js";
import { placeOrder } from "../services/api.js";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, delivery, grandTotal, freeDeliveryThreshold, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const orderItems = useMemo(
    () =>
      items.map((i) => ({
        foodId: i.foodId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    [items]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    try {
      setSubmitting(true);
      const userId = getOrCreateUserId();
      await placeOrder({
        userId,
        items: orderItems,
        totalAmount: grandTotal,
        address: notes.trim()
          ? `${address.trim()}\n\nNotes: ${notes.trim()}`
          : address.trim(),
      });
      clearCart();
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">Checkout</h1>
      <p className="mt-1 text-sm text-slate-600">
        Totals include delivery charges based on your cart subtotal.
      </p>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="font-semibold text-ink-900">Nothing to checkout</div>
          <p className="mt-2 text-sm text-slate-600">Add items to your cart first.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to menu
          </button>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="text-sm font-semibold text-ink-900" htmlFor="address">
                Delivery address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-brand-500/30 focus:border-brand-500 focus:bg-white focus:ring-4"
                placeholder="House / street, area, city…"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-ink-900" htmlFor="notes">
                Notes (optional)
              </label>
              <input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-brand-500/30 focus:border-brand-500 focus:bg-white focus:ring-4"
                placeholder="Gate code, landmark, etc."
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
                {error}
              </div>
            ) : null}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.99 }}
              className="w-full rounded-2xl bg-ink-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place order"}
            </motion.button>
          </motion.div>

          <BillSummary
            subtotal={subtotal}
            delivery={delivery}
            grandTotal={grandTotal}
            freeDeliveryThreshold={freeDeliveryThreshold}
          />
        </form>
      )}
    </div>
  );
}
