const MAX_W = 2000;

/** Live electrical load as a vertical battery gauge (detached from device floor plan). */
export default function LiveLoadBattery({ powerW }) {
  const w = Number(powerW) || 0;
  const pct = Math.min(100, (w / MAX_W) * 100);
  const innerTop = 22;
  const innerH = 96;
  const innerBottom = innerTop + innerH;
  const fillH = Math.max((pct / 100) * innerH, w > 0 && pct < 2 ? 2 : 0);
  const fillY = innerBottom - fillH;
  const fillColor = w >= 600 ? '#dc2626' : w >= 300 ? '#d97706' : '#16a34a';

  return (
    <section className="flex h-full min-h-[11rem] flex-col rounded-2xl border-2 border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-slate-600 dark:from-slate-900 dark:to-slate-800/90 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="border-b-2 border-slate-200 px-3 py-2.5 dark:border-slate-600 sm:px-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
          Live load
        </p>
        <p className="mt-0.5 font-body text-[11px] text-slate-500 dark:text-slate-500">ACS712 · sent to API</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-4 sm:flex-row sm:justify-around sm:px-4">
        <svg viewBox="0 0 72 132" className="h-[7.5rem] w-auto shrink-0" aria-hidden>
          <rect x="26" y="6" width="20" height="8" rx="2" fill="#94a3b8" />
          <rect x="16" y="14" width="40" height="108" rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" className="dark:fill-slate-800 dark:stroke-slate-500" />
          <rect x="20" y={fillY} width="32" height={fillH} rx="6" fill={fillColor} className="transition-all duration-500 ease-out" />
          <rect x="22" y="18" width="28" height="100" rx="8" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" className="dark:stroke-slate-600" />
        </svg>
        <div className="text-center sm:text-left">
          <p className="font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{w}W</p>
          <p className="mt-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">max scale {MAX_W}W</p>
        </div>
      </div>
    </section>
  );
}
