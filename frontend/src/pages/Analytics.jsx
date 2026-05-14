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

const accent = '#0ea5e9';
const red = '#dc2626';

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
          backgroundColor: values.map((v) => (v === mx && v > 0 ? red : accent)),
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
          borderColor: '#d97706',
          backgroundColor: 'rgba(14, 165, 233, 0.12)',
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
      <div className="mx-auto max-w-5xl px-4 py-8 font-mono text-sm text-red-600 dark:text-red-400">
        Failed to load analytics: {err}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 font-body text-slate-600 dark:text-slate-400">Loading analytics…</div>
    );
  }

  return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6 dark:text-slate-100">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="mt-1 font-body text-sm text-slate-600 dark:text-slate-400">
          Based on <span className="font-semibold text-sky-600">{data.total_rows}</span> manual rows ({data.wastage_rows}{' '}
          wastage).
        </p>
      </div>
      {roomChart && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Wastage by room</h2>
          <div className="h-64">
            <Bar
              data={roomChart}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                  y: { ticks: { color: '#64748b' }, grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      )}
      {timeChart && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Wastage by time slot</h2>
          <div className="h-64">
            <Line
              data={timeChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#64748b' } } },
                scales: {
                  x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                  y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
                },
              }}
            />
          </div>
        </div>
      )}
      {heatmap && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Wastage heatmap (day × hour bucket)
          </h2>
          <div className="overflow-x-auto">
            <div
              className="grid gap-1 text-[10px]"
              style={{ gridTemplateColumns: `96px repeat(${heatmap.col_labels.length}, minmax(0,1fr))` }}
            >
              <div />
              {heatmap.col_labels.map((c) => (
                <div key={c} className="truncate px-0.5 text-center text-slate-500">
                  {c}
                </div>
              ))}
              {heatmap.matrix.map((row, ri) => (
                <Fragment key={ri}>
                  <div className="flex items-center pr-1 text-slate-600">{heatmap.row_labels[ri]}</div>
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      className="flex h-8 items-center justify-center rounded border border-slate-100 text-slate-700"
                      style={{
                        background: `rgba(220,38,38,${0.08 + (cell / maxH) * 0.55})`,
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
