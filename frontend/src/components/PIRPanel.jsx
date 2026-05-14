export default function PIRPanel({ occupancy, onChange, compact }) {
  const occupied = occupancy === 1;
  return (
    <button
      type="button"
      onClick={() => onChange(occupied ? 0 : 1)}
      className={`relative flex flex-col items-center justify-center rounded-full border-2 transition-colors ${
        compact ? 'h-20 w-20' : 'h-24 w-24'
      } ${occupied ? 'border-[#00e5ff] bg-[#00e5ff11]' : 'border-white/20 bg-[#0a0c12]'}`}
    >
      {occupied && (
        <>
          <span
            className="absolute inset-2 rounded-full border border-[#00e5ff66]"
            style={{ animation: 'radar-ring 2s ease-out infinite' }}
          />
          <span
            className="absolute inset-2 rounded-full border border-[#00e5ff44]"
            style={{ animation: 'radar-ring 2s ease-out infinite 0.6s' }}
          />
        </>
      )}
      <span
        className={`font-orbitron text-[9px] tracking-wider ${
          occupied ? 'text-[#00e5ff] drop-shadow-[0_0_6px_#00e5ff]' : 'text-gray-500'
        }`}
      >
        {occupied ? 'MOTION' : 'NO MOTION'}
      </span>
      <span className="text-[8px] text-gray-500 mt-0.5">tap</span>
    </button>
  );
}
