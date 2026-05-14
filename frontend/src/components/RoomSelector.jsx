const iconFor = (id) => {
  if (id.startsWith('Class')) return '🏫';
  if (id.startsWith('Lab')) return '💻';
  if (id === 'StaffRoom') return '👤';
  return '🏢';
};

export default function RoomSelector({ rooms, selected, onSelect, lastStatus }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-4 py-2">
      {rooms.map((id) => {
        const active = id === selected;
        const dot =
          lastStatus[id] === 'wastage'
            ? 'bg-[#ff3d3d]'
            : lastStatus[id] === 'optimal'
              ? 'bg-[#00e676]'
              : 'bg-gray-600';
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`relative rounded-lg border px-2 py-2 text-left transition-all ${
              active
                ? 'border-[#00e5ff] shadow-[0_0_20px_#00e5ff44] scale-105 bg-[#151922]'
                : 'border-white/10 bg-[#12151c] hover:border-white/20'
            }`}
          >
            <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ${dot}`} />
            <div className="text-xl mb-1">{iconFor(id)}</div>
            <div className="font-orbitron text-xs text-[#00e5ff]">{id}</div>
          </button>
        );
      })}
    </div>
  );
}
