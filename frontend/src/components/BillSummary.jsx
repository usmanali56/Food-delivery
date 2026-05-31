function formatPkr(n) {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

export default function BillSummary({ subtotal, delivery, grandTotal, freeDeliveryThreshold }) {
  const freeApplied = delivery === 0 && subtotal > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="font-display text-lg font-bold text-ink-900">Order summary</div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="font-semibold text-ink-900">{formatPkr(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Delivery</dt>
          <dd className="font-semibold text-ink-900">
            {freeApplied ? (
              <span className="text-emerald-700">Free</span>
            ) : (
              formatPkr(delivery)
            )}
          </dd>
        </div>
        <div className="border-t border-slate-200 pt-2 text-base">
          <div className="flex items-center justify-between">
            <dt className="font-semibold text-ink-900">Total</dt>
            <dd className="font-display text-xl font-bold text-brand-700">{formatPkr(grandTotal)}</dd>
          </div>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-500">
        Free delivery applies when your subtotal is above{" "}
        <span className="font-semibold text-slate-700">
          PKR {freeDeliveryThreshold.toLocaleString("en-PK")}
        </span>
        . Otherwise, delivery is <span className="font-semibold">PKR 150</span>.
      </p>
    </div>
  );
}
