export default function SavingsCounter({ kwh, co2, alerts, alertRecipientMasked, showEmailFooter = true }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
        <svg className="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Cumulative impact</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center sm:gap-4">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">kWh saved</div>
          <div className="mt-1 font-display text-xl font-bold tabular-nums text-emerald-600 sm:text-2xl">
            {Number(kwh).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">CO₂ avoided (kg)</div>
          <div className="mt-1 font-display text-xl font-bold tabular-nums text-emerald-600 sm:text-2xl">
            {Number(co2).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-500">Wastage events</div>
          <div className="mt-1 font-display text-xl font-bold tabular-nums text-amber-500 sm:text-2xl">
            {Math.round(Number(alerts))}
          </div>
        </div>
      </div>
      {showEmailFooter && (
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-body text-[10px] leading-snug text-slate-600">
          <span className="text-slate-500">Alert recipient (masked): </span>
          {alertRecipientMasked ? (
            <span className="font-mono text-sky-700">{alertRecipientMasked}</span>
          ) : (
            <span className="text-amber-700">Not configured — add RECIPIENT_EMAIL in backend .env</span>
          )}
        </div>
      )}
    </div>
  );
}
