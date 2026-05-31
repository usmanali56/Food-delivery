import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import FoodCard from "../components/FoodCard.jsx";
import { fetchFoods } from "../services/api.js";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchFoods();
        if (!cancelled) setFoods(data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e.message || "Failed to load menu");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(foods.map((f) => f.category));
    return ["All", ...Array.from(set)];
  }, [foods]);

  const [filter, setFilter] = useState("All");
  const filtered = useMemo(() => {
    if (filter === "All") return foods;
    return foods.filter((f) => f.category === filter);
  }, [foods, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Today’s picks
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Hungry? Let’s make it{" "}
            <span className="bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent">
              delicious
            </span>
            .
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-600 sm:text-base">
            Browse dishes from the API-backed menu, add items to your cart, and checkout with live
            totals including delivery rules.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="font-display text-lg font-bold text-ink-900">Quick tips</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <span className="font-semibold text-ink-900">Cart</span> updates instantly across
              pages via Context.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Delivery</span> is free when subtotal{" "}
              {">"} PKR 1,000.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Orders</span> are saved per browser using
              a simple user id.
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        {categories.map((c) => {
          const active = c === filter;
          return (
            <motion.button
              key={c}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(c)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-ink-900 text-white shadow-md"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              {c}
            </motion.button>
          );
        })}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[340px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((food, idx) => (
            <FoodCard key={food._id} food={food} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
