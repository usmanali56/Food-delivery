import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { getMenuImageSrc } from "../lib/menuImages.js";

function formatPkr(n) {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

const PLACEHOLDER = "/placeholder-food.svg";

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;
  const [imgSrc, setImgSrc] = useState(
    () => getMenuImageSrc(item.name) || item.image || PLACEHOLDER
  );

  useEffect(() => {
    setImgSrc(getMenuImageSrc(item.name) || item.image || PLACEHOLDER);
  }, [item.foodId, item.name, item.image]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <img
        src={imgSrc}
        alt=""
        className="h-20 w-24 rounded-xl object-cover bg-slate-100"
        loading="lazy"
        onError={() => setImgSrc(PLACEHOLDER)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-semibold text-ink-900">{item.name}</div>
            <div className="text-xs text-slate-500">{item.category}</div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.foodId)}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            Remove
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-brand-700">{formatPkr(lineTotal)}</div>
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => decreaseQty(item.foodId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-sm"
              aria-label="Decrease quantity"
            >
              −
            </motion.button>
            <div className="min-w-[2.25rem] text-center text-sm font-semibold">{item.quantity}</div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => increaseQty(item.foodId)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-sm"
              aria-label="Increase quantity"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
