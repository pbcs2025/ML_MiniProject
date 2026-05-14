import PIRPanel from './PIRPanel.jsx';

const MAX_W = 760;

export default function DevicePanel({
  roomId,
  occupancy,
  onOccupancyChange,
  devices,
  onToggle,
  showWastageTint,
}) {
  const { fan, light, ac, projector } = devices;
  const staff = roomId === 'StaffRoom';
  const power =
    fan * 120 + light * 60 + ac * 1500 + (staff ? 0 : projector) * 300;
  const fillPct = Math.min(100, (power / MAX_W) * 100);
  const barColor =
    fillPct < 33 ? '#00e676' : fillPct < 66 ? '#ffc107' : '#ff3d3d';

  const pulse = (key) => {
    onToggle(key);
  };

  return (
    <div
      className={`relative rounded-xl border border-white/10 overflow-hidden transition-colors ${
        occupancy ? 'bg-[#161a22]' : 'bg-[#10131a]'
      }`}
    >
      {showWastageTint && (
        <div className="absolute inset-0 bg-[#ff3d3d]/18 pointer-events-none z-10" />
      )}
      <div className="relative">
        <svg viewBox="0 0 420 240" className="w-full h-auto block select-none">
          <defs>
            <radialGradient id="fanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <filter id="lightGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            x="16"
            y="16"
            width="388"
            height="208"
            rx="12"
            fill="#0b0d12"
            stroke="#1f2937"
            strokeWidth="2"
          />
          <g
            onClick={() => pulse('fan')}
            className="cursor-pointer"
            title="Fan — 120W — Click to toggle"
          >
            <circle cx="210" cy="72" r="44" fill={fan ? 'url(#fanGlow)' : 'none'} />
            <g
              style={
                fan
                  ? { transformOrigin: '210px 72px', animation: 'spin-fan 1.2s linear infinite' }
                  : {}
              }
            >
              {[0, 90, 180, 270].map((a) => (
                <rect
                  key={a}
                  x="200"
                  y="44"
                  width="20"
                  height="56"
                  rx="4"
                  fill={fan ? '#6b7a8c' : '#3d4555'}
                  transform={`rotate(${a} 210 72)`}
                />
              ))}
            </g>
            <circle cx="210" cy="72" r="10" fill={fan ? '#00e5ff' : '#4b5563'} />
          </g>
          <g
            onClick={() => pulse('light')}
            className="cursor-pointer"
            title="Lights — 60W — Click to toggle"
          >
            <circle
              cx="110"
              cy="120"
              r="18"
              fill={light ? '#fbbf24' : '#374151'}
              stroke="#9ca3af"
              strokeWidth="1"
              filter={light ? 'url(#lightGlow)' : undefined}
            />
            <circle
              cx="310"
              cy="120"
              r="18"
              fill={light ? '#fbbf24' : '#374151'}
              stroke="#9ca3af"
              strokeWidth="1"
              filter={light ? 'url(#lightGlow)' : undefined}
            />
          </g>
          <g
            onClick={() => !staff && pulse('projector')}
            className={staff ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
            title={
              staff
                ? 'No projector in Staff Room'
                : 'Projector — 300W — Click to toggle'
            }
          >
            <rect x="28" y="150" width="36" height="16" rx="3" fill="#4b5563" />
            {projector && !staff && (
              <polygon points="64,158 220,140 220,176" fill="#fde04744" stroke="#fde047aa" strokeWidth="1" />
            )}
          </g>
          <g onClick={() => pulse('ac')} className="cursor-pointer" title="AC — 1500W — Click to toggle">
            <rect x="178" y="188" width="64" height="28" rx="4" fill={ac ? '#38bdf8' : '#374151'} />
            <text
              x="210"
              y="206"
              textAnchor="middle"
              fill={ac ? '#0f172a' : '#e5e7eb'}
              fontSize="10"
              fontFamily="sans-serif"
            >
              AC
            </text>
          </g>
          <g transform="translate(36,188)">
            <rect x="0" y="0" width="36" height="36" rx="6" fill="#111827" stroke="#374151" />
            <circle cx="18" cy="14" r="6" fill={occupancy ? '#00e5ff' : '#6b7280'} />
            <text x="18" y="32" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="sans-serif">
              {occupancy ? 'IN' : 'OUT'}
            </text>
          </g>
        </svg>
        <div className="absolute top-2 right-2 z-20">
          <PIRPanel occupancy={occupancy} onChange={onOccupancyChange} compact />
        </div>
      </div>
      <div className="px-4 pb-3 pt-1">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Load</span>
          <span>
            {power}W / {MAX_W}W
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#1a1f2e] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${fillPct}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
}
