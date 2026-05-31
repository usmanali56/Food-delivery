import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { getMenuImageSrc } from "../lib/menuImages.js";

function formatPkr(n) {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

const PLACEHOLDER = "/placeholder-food.svg";

export default function FoodCard({ food, index = 0 }) {
  const { addToCart, items } = useCart();
  const inCart = items.find((i) => i.foodId === food._id);
  const qty = inCart?.quantity ?? 0;
  const [imgSrc, setImgSrc] = useState(() => getMenuImageSrc(food.name) ?? PLACEHOLDER);

  useEffect(() => {
    setImgSrc(getMenuImageSrc(food.name) ?? PLACEHOLDER);
  }, [food._id, food.name]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          src={imgSrc}
          alt={food.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER)}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
          {food.category}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-900">{food.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{food.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-bold text-brand-700">{formatPkr(food.price)}</div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => addToCart(food)}
            className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition group-hover:bg-brand-600"
          >
            Add{qty ? ` (${qty})` : ""}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
