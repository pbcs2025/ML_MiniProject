import { useId } from 'react';
import PIRPanel from './PIRPanel.jsx';

/** Floor plan: screen wall, troffer lights, projector just above room centre, twin fans below, wall AC. */
export default function DevicePanel({
  roomId,
  occupancy,
  onOccupancyChange,
  devices,
  onToggle,
  showWastageTint,
  showCornerPir = true,
}) {
  const gid = useId().replace(/:/g, '');
  const { fan, light, ac, projector } = devices;
  const staff = roomId === 'StaffRoom';

  const bladeOn = '#0ea5e7';
  const bladeOff = '#94a3b8';

  const renderFan = (cx, cy) => (
    <g key={`fan-${cx}-${cy}`} onClick={() => onToggle('fan')} className="cursor-pointer" role="presentation">
      {fan && <circle cx={cx} cy={cy} r="34" fill={`url(#${gid}-fanGlow)`} />}
      <g transform={`translate(${cx} ${cy})`}>
        <g className={fan ? 'fan-blades' : undefined}>
          {[22, 112, 202, 292].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <rect
                x="-4"
                y="-30"
                width="8"
                height="28"
                rx="4"
                fill={fan ? bladeOn : bladeOff}
                transform="skewX(-6)"
              />
            </g>
          ))}
        </g>
        <circle r="9" fill={fan ? '#0284c7' : '#64748b'} stroke={fan ? '#0369a1' : '#475569'} strokeWidth="1" />
        <circle r="3.5" fill={fan ? '#e0f2fe' : '#cbd5e1'} />
      </g>
    </g>
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-2 border-slate-300 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)] dark:border-slate-600 dark:bg-slate-900 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <p className="border-b-2 border-slate-200 px-4 py-2.5 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600 dark:border-slate-600 dark:text-slate-400 sm:px-5">
        Device control · ACS712 sensors · room layout
      </p>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-xl bg-slate-50/90 dark:bg-slate-800/45">
        {showWastageTint && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-red-500/10" aria-hidden />
        )}
        <div className="relative flex min-h-0 flex-1 items-center px-1 py-2">
          <svg
            viewBox="0 0 420 248"
            className="block w-full min-h-[200px] max-h-[min(62vh,520px)] shrink-0 select-none"
            role="img"
            aria-label="Room device layout"
          >
            <defs>
              <radialGradient id={`${gid}-fanGlow`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`${gid}-bulbGlow`} cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#fde047" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`${gid}-floor`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#eef2f7" />
              </linearGradient>
            </defs>

            {/* Room shell — thick border; interior center ≈ (210, 124) */}
            <rect
              x="10"
              y="10"
              width="400"
              height="230"
              rx="16"
              fill={`url(#${gid}-floor)`}
              stroke="#475569"
              strokeWidth="3.5"
            />
            <line x1="22" y1="228" x2="398" y2="228" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 6" />

            <rect x="88" y="16" width="244" height="18" rx="4" fill="#dce4ec" stroke="#64748b" strokeWidth="1.5" />
            <rect x="96" y="20" width="228" height="10" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="210" y="27" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">
              Screen / board wall
            </text>

            {/* Projector shadow cast on screen (visible when lamp is on) */}
            {!staff && projector && (
              <ellipse cx="210" cy="28" rx="82" ry="7" fill="rgba(15,23,42,0.14)" opacity="0.95" />
            )}
            {!staff && projector && (
              <ellipse cx="210" cy="28" rx="56" ry="4" fill="rgba(251,191,36,0.22)" />
            )}

            <g onClick={() => onToggle('light')} className="cursor-pointer" role="presentation">
              {light && <ellipse cx="78" cy="58" rx="34" ry="16" fill={`url(#${gid}-bulbGlow)`} opacity="0.85" />}
              <rect x="50" y="50" width="56" height="18" rx="6" fill={light ? '#fefce8' : '#e2e8f0'} stroke={light ? '#ca8a04' : '#94a3b8'} strokeWidth="2" />
              <rect x="58" y="54" width="40" height="4" rx="1" fill={light ? '#fde047' : '#cbd5e1'} />
              <rect x="58" y="60" width="40" height="4" rx="1" fill={light ? '#fde047' : '#cbd5e1'} />
              <text
                x="78"
                y="76"
                textAnchor="middle"
                fill="#64748b"
                fontSize="7"
                fontFamily="Inter, sans-serif"
                pointerEvents="none"
              >
                Ceiling light
              </text>
            </g>
            <g onClick={() => onToggle('light')} className="cursor-pointer" role="presentation">
              {light && <ellipse cx="342" cy="58" rx="34" ry="16" fill={`url(#${gid}-bulbGlow)`} opacity="0.85" />}
              <rect x="314" y="50" width="56" height="18" rx="6" fill={light ? '#fefce8' : '#e2e8f0'} stroke={light ? '#ca8a04' : '#94a3b8'} strokeWidth="2" />
              <rect x="322" y="54" width="40" height="4" rx="1" fill={light ? '#fde047' : '#cbd5e1'} />
              <rect x="322" y="60" width="40" height="4" rx="1" fill={light ? '#fde047' : '#cbd5e1'} />
              <text
                x="342"
                y="76"
                textAnchor="middle"
                fill="#64748b"
                fontSize="7"
                fontFamily="Inter, sans-serif"
                pointerEvents="none"
              >
                Ceiling light
              </text>
            </g>

            {/* Ceiling projector — horizontally centered, slightly above room midpoint (210,124) → body ~y99–129 */}
            <g
              onClick={() => !staff && onToggle('projector')}
              className={staff ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
              role="presentation"
            >
              {!staff && projector && (
                <polygon
                  points="210,98 108,34 312,34"
                  fill="rgba(254,240,138,0.38)"
                  stroke="rgba(217,119,6,0.45)"
                  strokeWidth="1.2"
                />
              )}
              <rect
                x="174"
                y="99"
                width="72"
                height="30"
                rx="9"
                fill={!staff && projector ? '#1e293b' : '#64748b'}
                stroke={!staff && projector ? '#0f172a' : '#475569'}
                strokeWidth="2"
              />
              <circle cx="230" cy="114" r="10" fill={!staff && projector ? '#0f172a' : '#475569'} stroke="#334155" strokeWidth="1" />
              <rect x="182" y="104" width="28" height="3" rx="1" fill="#94a3b8" opacity="0.85" />
              <rect x="182" y="110" width="18" height="2" rx="1" fill="#94a3b8" opacity="0.65" />
              <text x="210" y="142" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif" pointerEvents="none">
                Projector
              </text>
            </g>

            {/* Twin ceiling fans — directly below projector row */}
            {renderFan(158, 180)}
            {renderFan(262, 180)}
            <text x="158" y="218" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif" pointerEvents="none">
              Ceiling fan
            </text>
            <text x="262" y="218" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif" pointerEvents="none">
              Ceiling fan
            </text>

            <g onClick={() => onToggle('ac')} className="cursor-pointer" role="presentation">
              {ac && <rect x="354" y="132" width="28" height="72" rx="8" fill="#bae6fd" opacity="0.45" />}
              <rect
                x="358"
                y="138"
                width="20"
                height="60"
                rx="6"
                fill={ac ? '#f1f5f9' : '#e2e8f0'}
                stroke={ac ? '#0ea5e9' : '#cbd5e1'}
                strokeWidth="2.5"
              />
              {[148, 156, 164, 172, 180, 188].map((y) => (
                <line key={y} x1="362" y1={y} x2="374" y2={y} stroke={ac ? '#64748b' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" />
              ))}
              <circle cx="370" cy="144" r="3.5" fill={ac ? '#22c55e' : '#cbd5e1'} />
              <text x="368" y="214" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700" pointerEvents="none">
                AC
              </text>
            </g>

            {/* Door-side IN / OUT (same control as PIR card) */}
            <g transform="translate(22, 192)" onClick={() => onOccupancyChange(occupancy ? 0 : 1)} className="cursor-pointer" role="presentation">
              <rect width="44" height="44" rx="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="22" cy="18" r="8" fill={occupancy ? '#0ea5e9' : '#cbd5e1'} />
              <text x="22" y="38" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">
                {occupancy ? 'IN' : 'OUT'}
              </text>
            </g>
          </svg>
          {showCornerPir && (
            <div className="absolute right-2 top-2 z-20">
              <PIRPanel occupancy={occupancy} onChange={onOccupancyChange} compact light />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
