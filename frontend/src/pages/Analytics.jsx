import { useEffect, useMemo, useState, Fragment } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getAnalyticsSummary } from '../api/flaskApi.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const teal = '#00e5ff';
const red = '#ff3d3d';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setData)
      .catch((e) => setErr(String(e)));
  }, []);

  const roomChart = useMemo(() => {
    if (!data?.by_room) return null;
    const labels = Object.keys(data.by_room);
    const values = labels.map((k) => data.by_room[k]);
    const mx = Math.max(1, ...values);
    return {
      labels,
      datasets: [
        {
          label: 'Wastage events',
          data: values,
          backgroundColor: values.map((v) => (v === mx && v > 0 ? red : teal)),
        },
      ],
    };
  }, [data]);

  const timeChart = useMemo(() => {
    if (!data?.by_time_slot) return null;
    const entries = Object.entries(data.by_time_slot).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
    return {
      labels: entries.map(([k]) => k),
      datasets: [
        {
          label: 'Wastage by logged time label',
          data: entries.map(([, v]) => v),
          borderColor: teal,
          backgroundColor: '#00e5ff22',
          tension: 0.25,
          fill: true,
        },
      ],
    };
  }, [data]);

  const heatmap = data?.heatmap;
  const maxH = useMemo(() => {
    if (!heatmap?.matrix) return 1;
    return Math.max(1, ...heatmap.matrix.flat());
  }, [heatmap]);

  if (err) {
    return (
      <div className="p-6 text-red-400 font-mono text-sm">
        Failed to load analytics: {err}
      </div>
    );
  }
  if (!data) {
    return <div className="p-6 text-gray-400">Loading analytics…</div>;
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <p className="text-sm text-gray-400">
        Based on <span className="text-[#00e5ff]">{data.total_rows}</span> manual rows (
        {data.wastage_rows} wastage).
      </p>
      {roomChart && (
        <div className="rounded-xl border border-white/10 bg-[#12151c] p-4">
          <h2 className="font-orbitron text-sm text-[#00e5ff] mb-2">Wastage by room</h2>
          <div className="h-64">
            <Bar
              data={roomChart}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#9ca3af' }, grid: { color: '#ffffff11' } },
                  y: { ticks: { color: '#9ca3af' }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      )}
      {timeChart && (
        <div className="rounded-xl border border-white/10 bg-[#12151c] p-4">
          <h2 className="font-orbitron text-sm text-[#00e5ff] mb-2">Wastage by time slot</h2>
          <div className="h-64">
            <Line
              data={timeChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#9ca3af' } } },
                scales: {
                  x: { ticks: { color: '#9ca3af' }, grid: { color: '#ffffff11' } },
                  y: { ticks: { color: '#9ca3af' }, grid: { color: '#ffffff11' } },
                },
              }}
            />
          </div>
        </div>
      )}
      {heatmap && (
        <div className="rounded-xl border border-white/10 bg-[#12151c] p-4">
          <h2 className="font-orbitron text-sm text-[#00e5ff] mb-2">
            Wastage heatmap (day × hour bucket)
          </h2>
          <div className="overflow-x-auto">
            <div
              className="grid gap-1 text-[10px]"
              style={{ gridTemplateColumns: `96px repeat(${heatmap.col_labels.length}, minmax(0,1fr))` }}
            >
              <div />
              {heatmap.col_labels.map((c) => (
                <div key={c} className="text-center text-gray-500 truncate px-0.5">
                  {c}
                </div>
              ))}
              {heatmap.matrix.map((row, ri) => (
                <Fragment key={ri}>
                  <div className="text-gray-400 pr-1 flex items-center">
                    {heatmap.row_labels[ri]}
                  </div>
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      className="h-8 rounded border border-white/5 flex items-center justify-center text-gray-300"
                      style={{
                        background: `rgba(255,61,61,${0.15 + (cell / maxH) * 0.75})`,
                      }}
                      title={`${heatmap.row_labels[ri]} ${heatmap.col_labels[ci]}: ${cell}`}
                    >
                      {cell || ''}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
