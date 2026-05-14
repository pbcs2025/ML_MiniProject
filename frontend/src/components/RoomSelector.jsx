function categoryFor(id) {
  if (id.startsWith('Class')) return 'CLASSROOM';
  if (id.startsWith('Lab')) return 'LAB';
  if (id === 'StaffRoom') return 'STAFF ROOM';
  return 'ROOM';
}

export default function RoomSelector({ rooms, selected, onSelect, lastStatus }) {
  return (
    <section className="rounded-2xl border-2 border-slate-300 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/90 p-4 shadow-[0_4px_14px_rgba(15,23,42,0.07)] dark:border-slate-600 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/95 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] sm:p-5">
      <div className="mb-4 flex items-center gap-2 border-b-2 border-slate-200/90 pb-3 dark:border-slate-600">
        <svg
          className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
        </svg>
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
          Select room
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-3.5">
        {rooms.map((id) => {
          const active = id === selected;
          const dot =
            lastStatus[id] === 'wastage'
              ? 'bg-red-500'
              : lastStatus[id] === 'optimal'
                ? 'bg-emerald-500'
                : 'bg-slate-300 dark:bg-slate-500';
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`relative flex min-h-[5.75rem] flex-col rounded-xl border-2 bg-white p-2.5 text-left shadow-sm transition-all duration-200 dark:bg-slate-900/90 sm:min-h-[6.25rem] sm:p-3 md:min-h-[6.5rem] ${
                active
                  ? 'z-[1] border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25),0_8px_20px_rgba(16,185,129,0.18)] ring-2 ring-emerald-400/50 dark:border-emerald-400 dark:shadow-[0_0_0_3px_rgba(52,211,153,0.2)]'
                  : 'border-slate-300 hover:border-slate-400 hover:shadow-md dark:border-slate-600 dark:hover:border-slate-500'
              }`}
            >
              <span className={`absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${dot}`} aria-hidden />
              <span className="font-body text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-[10px]">
                {categoryFor(id)}
              </span>
              <span className="mt-auto font-body text-base font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-lg md:text-xl">
                {id}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
