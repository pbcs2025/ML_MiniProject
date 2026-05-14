/** Hero aligned with About page: light card, subtle border; dark mode variant. */
export default function DashboardHero() {
  return (
    <div className="relative overflow-hidden border-b border-slate-200/90 bg-[#f4f6f8] dark:border-slate-800 dark:bg-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[min(100%,90rem)] px-4 py-6 md:px-6 md:py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50/90 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 dark:shadow-none md:p-8">
          <p className="font-mono text-[11px] font-medium tracking-wide text-emerald-700 dark:text-emerald-400 md:text-xs">
            <span
              className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 align-middle dark:bg-emerald-400"
              aria-hidden
            />
            LIVE · ML INFERENCE ONLINE
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
                College Energy Control Room
              </h1>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
                Random Forest trained on 250 manual observations across 6 rooms
              </p>
            </div>
            <dl className="flex flex-wrap gap-6 font-mono text-xs md:gap-10 md:text-sm lg:justify-end">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                  Model acc
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 md:text-3xl">
                  94.0%
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                  Trees
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400 md:text-3xl">
                  120
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                  Rooms
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400 md:text-3xl">
                  6
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
