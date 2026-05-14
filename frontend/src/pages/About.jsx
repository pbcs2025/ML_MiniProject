/** Same JSON for both columns — syntax-styled for readability */
function JsonPayloadBlock() {
  return (
    <div className="rounded-xl bg-[#0f172a] p-5 font-mono text-[11px] leading-[1.65] shadow-inner sm:text-xs">
      <div className="text-slate-500">{'{'}</div>
      <div>
        <span className="text-sky-400">  &quot;room_id&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-amber-200">&quot;Lab1&quot;</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;occupancy&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">0</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;fan_status&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">1</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;light_status&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">1</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;ac_status&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">0</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;projector_status&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">1</span>
        <span className="text-slate-500">,</span>
      </div>
      <div>
        <span className="text-sky-400">  &quot;power_consumption_w&quot;</span>
        <span className="text-slate-500">: </span>
        <span className="text-emerald-400">480</span>
      </div>
      <div className="text-slate-500">{'}'}</div>
    </div>
  );
}

const HOW_STEPS = [
  {
    title: 'Data collection',
    body: 'Manual campus observations logged room-by-room with occupancy, devices, and time windows.',
  },
  {
    title: 'ML training',
    body: 'Random Forest trained on 250+ real observations merged with simulated IoT rows.',
  },
  {
    title: 'Live prediction',
    body: 'Flask API reads the same JSON a BMS or dashboard would send and scores wastage risk.',
  },
  {
    title: 'Staff alert',
    body: 'Email via SMTP when wastage is predicted, including estimated kWh if load is removed.',
  },
];

const ROOMS = [
  ['Class1', 'Fan, lights, projector, AC', 'Peak use in teaching hours'],
  ['Class2', 'Fan, lights, projector, AC', 'Break-time idle load risk'],
  ['Class3', 'Fan, lights, projector, AC', 'Similar to Class1–2'],
  ['Lab1', 'Fan, lights, projector, AC', 'Projectors often left on'],
  ['Lab2', 'Fan, lights, projector, AC', 'Highest wastage in sample set'],
  ['StaffRoom', 'Fan, lights, AC', 'No projector; smaller baseline load'],
];

export default function About() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f4f6f8] pb-16 pt-8 dark:bg-slate-950 md:pb-20 md:pt-10">
      <article className="mx-auto max-w-5xl space-y-10 px-4 md:space-y-12 md:px-6 lg:px-8">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50/90 p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 dark:shadow-none md:p-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            Smart Energy Optimizer
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
            ML-powered energy wastage detection for college buildings.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-sky-200/80 bg-[#ebf8ff] px-4 py-1.5 font-body text-xs font-semibold text-[#2b6cb0] shadow-sm">
              250 manual observations
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100/90 px-4 py-1.5 font-body text-xs font-semibold text-slate-800 shadow-sm">
              6 rooms monitored
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-200/80 bg-[#f0fff4] px-4 py-1.5 font-body text-xs font-semibold text-[#2f855a] shadow-sm">
              Random Forest · ~94% accuracy
            </span>
          </div>
        </header>

        {/* How it works — 4-up on large screens */}
        <section>
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((step) => (
              <div
                key={step.title}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-md"
              >
                <h3 className="font-body text-base font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology — single large card */}
        <section className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_32px_rgba(15,23,42,0.04)] md:p-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">
            Data collection methodology
          </h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 font-body text-sm leading-relaxed text-slate-700 marker:text-sky-500 md:text-[15px]">
            <li>Team members visited six college rooms across two weeks.</li>
            <li>
              Each observation recorded time slot, occupancy, fan / light / projector / AC status, and estimated power.
            </li>
            <li>Two hundred fifty real observations across Class1–Class3, Lab1–Lab2, and StaffRoom.</li>
            <li>
              Morning (9–12), lunch break (1–2 PM), and after-hours (after 4:30 PM) windows captured; break and
              after-hours showed higher wastage rates.
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-slate-200 bg-[#f3f4f6] p-6 md:p-8">
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dataset summary
            </p>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 font-mono text-sm text-slate-800 sm:grid-cols-2">
              <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2 sm:block sm:border-0 sm:py-0">
                <span className="text-slate-600">Total observations</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 dark:text-slate-100">250</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2 sm:block sm:border-0 sm:py-0">
                <span className="text-slate-600">Wastage events</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">90</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2 sm:block sm:border-0 sm:py-0">
                <span className="text-slate-600">Optimal events</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">160</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2 sm:block sm:border-0 sm:py-0">
                <span className="text-slate-600">Wastage rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">36%</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-200/80 py-2 sm:block sm:border-0 sm:py-0">
                <span className="text-slate-600">Most wasteful (sample)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Lab2</span>
              </div>
              <div className="flex justify-between gap-4 py-2 sm:block sm:py-0">
                <span className="text-slate-600">Collection period</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Feb 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* IoT comparison */}
        <section className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] md:p-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">
            Why dashboard toggles equal real IoT
          </h2>
          <p className="mt-4 max-w-3xl font-body text-sm leading-relaxed text-slate-600 md:text-[15px]">
            In production, a PIR sensor reports occupancy and current sensors infer device on/off. The dashboard sends the
            same JSON fields to Flask; the Random Forest sees identical features. Connecting physical hardware later does
            not require changing the model or API contract.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Dashboard (current)
              </p>
              <div className="mt-3">
                <JsonPayloadBlock />
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                IoT deployment (future)
              </p>
              <div className="mt-3">
                <JsonPayloadBlock />
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">Tech stack</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse font-body text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <th className="px-5 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Layer
                    </th>
                    <th className="px-5 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Technology
                    </th>
                    <th className="px-5 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    ['Data', 'Manual observation + CSV', '250 real campus observations'],
                    ['ML', 'Random Forest (scikit-learn)', 'Predict wastage from device + occupancy state'],
                    ['API', 'Flask + Python', 'Inference, persistence, analytics'],
                    ['Database', 'MongoDB or SQLite', 'Prediction history and charts'],
                    ['UI', 'React + Chart.js', 'Dashboard, analytics, history'],
                    ['Notify', 'smtplib (Gmail)', 'Automatic staff email on wastage'],
                  ].map(([layer, tech, purpose], i) => (
                    <tr key={layer} className={i % 2 === 1 ? 'bg-slate-50/40' : ''}>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">{layer}</td>
                      <td className="px-5 py-3.5 text-slate-700">{tech}</td>
                      <td className="px-5 py-3.5 text-slate-600">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section>
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">Rooms in scope</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map(([name, dev, note]) => (
              <div
                key={name}
                className="flex min-h-[160px] flex-col rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-md"
              >
                <p className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">{name}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">{dev}</p>
                <p className="mt-auto border-t border-slate-100 pt-4 font-body text-xs leading-relaxed text-slate-500">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-900 p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] md:p-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">Team</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-6">
              <p className="font-body text-base font-bold text-slate-900 dark:text-slate-100">Member 1</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">
                Data collection, labeling, dashboard UX.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-6">
              <p className="font-body text-base font-bold text-slate-900 dark:text-slate-100">Member 2</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-slate-600">
                Model training, Flask API, alerts, analytics.
              </p>
            </div>
          </div>
          <p className="mt-6 border-t border-slate-100 pt-5 text-center font-body text-xs italic text-slate-500 md:text-left">
            Replace the placeholder team lines with your real names and roles before submission.
          </p>
        </section>
      </article>
    </div>
  );
}
