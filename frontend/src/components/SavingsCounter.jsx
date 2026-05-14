export default function SavingsCounter({ kwh, co2, alerts, alertRecipientMasked, lastAlertSummary }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-white/10 bg-[#12151c] p-2">
          <div className="text-[10px] text-gray-500">kWh identified</div>
          <div className="font-orbitron text-[#00e5ff] text-sm transition-all duration-300">
            {kwh.toFixed(3)}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#12151c] p-2">
          <div className="text-[10px] text-gray-500">CO₂ avoided (kg)</div>
          <div className="font-orbitron text-[#00e676] text-sm transition-all duration-300">
            {co2.toFixed(3)}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#12151c] p-2">
          <div className="text-[10px] text-gray-500">Alerts (wastage)</div>
          <div className="font-orbitron text-[#ff3d3d] text-sm">{alerts}</div>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-[#0c0e14] px-3 py-2 text-[10px] text-gray-400 leading-snug">
        <span className="text-gray-500">Email recipient (masked): </span>
        {alertRecipientMasked ? (
          <span className="text-[#00e5ff] font-mono">{alertRecipientMasked}</span>
        ) : (
          <span className="text-amber-600/90">not configured — add RECIPIENT_EMAIL in backend `.env`</span>
        )}
        {lastAlertSummary && (
          <div className="mt-1 text-gray-500 font-mono">{lastAlertSummary}</div>
        )}
      </div>
    </div>
  );
}
