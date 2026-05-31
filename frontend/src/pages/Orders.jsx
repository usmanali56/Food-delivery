import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrCreateUserId } from "../lib/userId.js";
import { fetchOrdersByUser } from "../services/api.js";

function formatPkr(n) {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

const statusLabel = {
  pending: "Pending",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const userId = getOrCreateUserId();
        const data = await fetchOrdersByUser(userId);
        if (!cancelled) setOrders(data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e.message || "Failed to load orders");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">Your orders</h1>
      <p className="mt-1 text-sm text-slate-600">
        Orders are linked to this browser via a locally stored id (demo-friendly, no login).
      </p>

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"
        >
          <div className="text-4xl">📦</div>
          <div className="mt-3 font-display text-xl font-bold text-ink-900">No orders yet</div>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Place an order from checkout and it will show up here.
          </p>
        </motion.div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o, idx) => (
            <motion.li
              key={o._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order id
                  </div>
                  <div className="mt-1 font-mono text-sm text-ink-900">{o._id}</div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Status:{" "}
                    <span className="text-ink-900">{statusLabel[o.status] || o.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-brand-700">
                    {formatPkr(o.totalAmount)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Address
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{o.address}</div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Items
                </div>
                <ul className="mt-2 space-y-2">
                  {o.items.map((it, i) => (
                    <li key={`${o._id}-${i}`} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">
                        {it.name}{" "}
                        <span className="text-slate-500">× {it.quantity}</span>
                      </span>
                      <span className="font-semibold text-ink-900">
                        {formatPkr(it.price * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
