function formatTimeShort(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return String(iso);
  }
}

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

export default function RecentPredictionsLog({ entries }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
        <svg className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 12h4l3 8 4-16 3 8h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Recent predictions</h2>
      </div>
      <div className="max-h-[min(52vh,380px)] overflow-y-auto px-1 py-1">
        {!entries?.length && (
          <p className="px-3 py-8 text-center font-body text-sm text-slate-500">No predictions stored yet.</p>
        )}
        <ul className="divide-y divide-slate-100 font-mono text-[13px] leading-tight dark:divide-slate-700">
          {entries.map((row, i) => {
            const w = row.wastage_predicted === 1;
            const pct = Number(row.confidence ?? 0).toFixed(1);
            return (
              <li
                key={`${row.timestamp}-${row.room_id}-${i}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2.5 sm:gap-x-4"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${w ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span className="min-w-[3rem] font-body font-bold text-slate-900 dark:text-slate-100">{row.room_id}</span>
                <span className="text-slate-600 dark:text-slate-400">{Number(row.power_w ?? 0)}W</span>
                <span className={`min-w-[3.5rem] font-semibold tabular-nums ${w ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {pct}%
                </span>
                <span className="ml-auto flex shrink-0 flex-col items-end tabular-nums text-right text-[11px] text-slate-500 dark:text-slate-400 sm:text-[13px]">
                  <span>{formatDateShort(row.timestamp)}</span>
                  <span className="opacity-90">{formatTimeShort(row.timestamp)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
