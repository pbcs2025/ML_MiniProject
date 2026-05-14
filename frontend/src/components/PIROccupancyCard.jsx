/** PIR occupancy — power switch + status line after toggle. */
export default function PIROccupancyCard({ roomName, occupancy, onChange }) {
  const occupied = occupancy === 1;

  return (
    <section className="flex h-full min-h-[10rem] flex-col rounded-2xl border-2 border-slate-300 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-slate-600 dark:bg-slate-900 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="border-b-2 border-slate-200 px-3 py-2.5 dark:border-slate-600 sm:px-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
          PIR occupancy sensor
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-500">PIR_001 · {roomName || '—'}</p>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 px-3 py-4 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Occupancy
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={occupied}
            onClick={() => onChange(occupied ? 0 : 1)}
            className={`relative h-11 w-[4.75rem] shrink-0 rounded-full border-2 transition-colors ${
              occupied
                ? 'border-emerald-600 bg-emerald-600 shadow-inner dark:border-emerald-400 dark:bg-emerald-600'
                : 'border-slate-300 bg-slate-200 shadow-inner dark:border-slate-500 dark:bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-1 h-9 w-9 rounded-full border border-white/80 bg-white shadow-md transition-all duration-200 dark:border-slate-200 ${
                occupied ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
        <p
          role="status"
          className={`rounded-lg border px-3 py-2.5 font-body text-sm leading-snug ${
            occupied
              ? 'border-emerald-200/90 bg-emerald-50/90 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-rose-200/90 bg-rose-50/90 text-rose-900 dark:border-rose-800/50 dark:bg-rose-950/35 dark:text-rose-200'
          }`}
        >
          {occupied
            ? 'Occupied — presence detected. PIR input is on; the dashboard treats the room as having people.'
            : 'Empty — no presence. PIR input is off; the dashboard treats the room as unoccupied.'}
        </p>
      </div>
    </section>
  );
}
