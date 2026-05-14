import { motion } from 'framer-motion';

function Gauge({ value }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="relative h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center text-[9px] text-gray-300">
      <span>{v}%</span>
    </div>
  );
}

export default function PredictionCard({ result }) {
  if (!result) return null;
  const isWastage = result.wastage_predicted === 1;
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-xl border-2 p-3 flex items-center gap-3 ${
        isWastage ? 'bg-[#2e0a0a] border-[#ff3d3d]' : 'bg-[#0a2e1a] border-[#00e676]'
      }`}
      style={
        isWastage ? { animation: 'pulse-border 1.5s ease-in-out infinite' } : undefined
      }
    >
      <div
        className="text-3xl"
        style={isWastage ? { animation: 'flicker 1.2s ease-in-out infinite' } : undefined}
      >
        {isWastage ? '⚠' : '✓'}
      </div>
      <div className="flex-1">
        <p
          className={`font-orbitron text-lg ${
            isWastage ? 'text-[#ff3d3d]' : 'text-[#00e676]'
          }`}
        >
          {isWastage ? 'WASTAGE DETECTED' : 'OPTIMAL USAGE'}
        </p>
        <p className="text-xs text-gray-400">Room {result.room_id}</p>
      </div>
      <Gauge value={result.confidence} />
    </motion.div>
  );
}
