export default function AwaitingInferenceCard() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/90 px-6 py-12 text-center shadow-inner dark:border-slate-700 dark:bg-slate-800/40">
      <svg
        className="mb-4 h-16 w-16 text-slate-300 dark:text-slate-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden
      >
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Awaiting ML inference</p>
      <p className="mt-3 max-w-xs font-body text-sm text-slate-600 dark:text-slate-400">
        Configure room state above and run prediction
      </p>
    </div>
  );
}
