export default function PredictionCard({ result, powerW, occupancy, emailConfigured }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center font-body text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
        Run ML prediction to see confidence, recommendation, and savings for the current room state.
      </div>
    );
  }

  const isWastage = result.wastage_predicted === 1;
  const savings = result.savings || {};
  const kwh = Number(savings.kwh_if_switched_off ?? 0).toFixed(3);
  const co2 = Number(savings.co2_kg_avoided ?? 0).toFixed(3);
  const conf = Number(result.confidence ?? 0).toFixed(1);
  const mail = result.alert_email;
  const occ = occupancy === 1;
  const hour = new Date().getHours();
  const isBreak = !!result.is_break || (hour >= 10 && hour < 11) || (hour >= 13 && hour < 14);
  const afterHours = hour >= 17;

  let ctx = null;
  if (isWastage) {
    if (!occ) ctx = { text: 'NO OCCUPANCY', cls: 'bg-red-100 text-red-800' };
    else if (isBreak) ctx = { text: 'BREAK PERIOD', cls: 'bg-amber-100 text-amber-900' };
    else if (afterHours) ctx = { text: 'AFTER HOURS', cls: 'bg-amber-100 text-amber-900' };
  }

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
        isWastage
          ? 'wastage-card border-red-200 dark:border-red-800/80'
          : 'border-l-4 border-l-emerald-500 border-y border-r border-slate-200 dark:border-slate-600 dark:border-l-emerald-500'
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 font-body text-xs font-bold uppercase tracking-wide ${
              isWastage ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isWastage ? 'Wastage detected' : 'Optimal usage'}
          </span>
          <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">{result.room_id}</span>
        </div>
        {isWastage && <span className="font-display text-base font-bold text-amber-700">{powerW}W</span>}
      </div>

      {ctx && (
        <div className={`mb-3 inline-block rounded-md px-2 py-1 font-body text-xs font-semibold ${ctx.cls}`}>
          {ctx.text}
        </div>
      )}

      <div className="mb-3">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Confidence</p>
        <p className={`font-display text-3xl font-bold ${isWastage ? 'text-red-600' : 'text-emerald-600'}`}>{conf}%</p>
      </div>

      <p className="mb-3 font-body text-sm leading-relaxed text-slate-700">
        {isWastage
          ? 'Review occupancy versus electrical load and switch off equipment that is not required.'
          : 'No wastage pattern detected for this state. Continue monitoring.'}
      </p>

      {isWastage && result.recommendation && (
        <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800">
          {result.recommendation}
        </div>
      )}

      {isWastage && (
        <div className="mb-3 border-t border-slate-100 pt-3 font-body text-xs">
          {mail?.sent ? (
            <p className="font-medium text-emerald-700">Email alert sent to configured recipient.</p>
          ) : mail ? (
            <p className="text-slate-600">
              Email:{' '}
              <span className="font-mono text-amber-800">
                {mail.error === 'not_configured' || !emailConfigured
                  ? 'disabled — set ALERT_EMAIL, ALERT_PASSWORD, RECIPIENT_EMAIL in .env'
                  : mail.message || mail.error || 'not sent'}
              </span>
            </p>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-3 font-body text-xs text-slate-600">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Saved this event</span>
          <span className={`font-display text-lg font-bold ${isWastage ? 'text-emerald-600' : 'text-slate-400'}`}>
            {kwh} kWh
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">CO₂ avoided</span>
          <span className={`font-display text-lg font-bold ${isWastage ? 'text-emerald-600' : 'text-slate-400'}`}>
            {co2} kg
          </span>
        </div>
      </div>
    </div>
  );
}
