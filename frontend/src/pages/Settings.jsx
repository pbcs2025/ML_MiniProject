import { useEffect, useState } from 'react';
import { apiErrorMessage, getRecipientSettings, putRecipientSettings } from '../api/flaskApi.js';

export default function Settings() {
  const [textarea, setTextarea] = useState('');
  const [source, setSource] = useState('env');
  const [masked, setMasked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getRecipientSettings()
      .then((d) => {
        setSource(d.source || 'env');
        setMasked(d.recipients_masked || []);
        setTextarea((d.recipients || []).join('\n'));
      })
      .catch((e) => setError(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const lines = textarea
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await putRecipientSettings(lines);
      setMessage(res.source === 'env' ? 'Saved. Using recipients from .env (override cleared).' : 'Recipients saved.');
      setSource(res.source);
      setMasked(res.recipients_masked || []);
      setTextarea((res.recipients || []).join('\n'));
    } catch (e) {
      const msg = e.response?.data?.message || e.message || String(e);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const useEnvOnly = async () => {
    setTextarea('');
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await putRecipientSettings([]);
      setMessage('Cleared override. Recipients now come from RECIPIENT_EMAIL / STAFF_EMAIL in .env');
      setSource(res.source);
      setMasked(res.recipients_masked || []);
      setTextarea((res.recipients || []).join('\n'));
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-400">
        Wastage alerts are sent from your Gmail app account (<code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">ALERT_EMAIL</code> in{' '}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">.env</code>). Here you choose who receives those messages — one or
        many addresses.
      </p>

      <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-white to-slate-50/90 p-6 shadow-sm dark:border-slate-600 dark:from-slate-900 dark:to-slate-800/90 dark:shadow-none sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400">
            Alert recipients
          </h2>
          <span
            className={`rounded-full px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase ${
              source === 'settings_file'
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {source === 'settings_file' ? 'Saved list' : 'From .env'}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            <label htmlFor="recipients" className="block font-body text-xs font-medium text-slate-700 dark:text-slate-300">
              Email addresses (one per line, or comma-separated)
            </label>
            <textarea
              id="recipients"
              rows={6}
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
              placeholder={'staff1@college.edu\nstaff2@college.edu'}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none ring-sky-500/30 focus:border-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100"
            />
            {masked.length > 0 && (
              <p className="mt-2 font-body text-xs text-slate-500 dark:text-slate-400">
                Currently:{' '}
                <span className="font-mono text-slate-800 dark:text-slate-200">{masked.join(' · ')}</span>
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {saving ? 'Saving…' : 'Save recipients'}
              </button>
              <button
                type="button"
                onClick={useEnvOnly}
                disabled={saving}
                className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 font-body text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Use .env only
              </button>
            </div>
            {message && <p className="mt-3 font-body text-sm text-emerald-700 dark:text-emerald-400">{message}</p>}
            {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-800 dark:border-red-800/80 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
          </>
        )}
      </div>

      <p className="mt-6 font-body text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Recipients are stored in <code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">data/email_recipients.json</code> (not
        committed to git). Clearing the list removes that file and restores{' '}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">RECIPIENT_EMAIL</code> (comma-separated for multiple) or{' '}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">STAFF_EMAIL</code> from <code className="rounded bg-slate-100 px-1 dark:bg-slate-800 dark:text-slate-200">.env</code>.
      </p>
    </div>
  );
}
