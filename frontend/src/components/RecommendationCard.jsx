import { useEffect, useState } from 'react';

export default function RecommendationCard({ text }) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (!text) {
      setShown('');
      return;
    }
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  if (!text) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-[#00e5ff] min-h-[3rem]">
      {shown}
      <span className="inline-block w-2 border-l border-[#00e5ff] ml-0.5 animate-[type-caret_1s_step-end_infinite]" />
    </div>
  );
}
