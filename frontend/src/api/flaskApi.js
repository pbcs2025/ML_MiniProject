import axios from 'axios';

/** In Vite dev, default to same-origin `/api` (see vite.config.js proxy). Override with VITE_API_URL if needed. */
const BASE =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
  (import.meta.env.DEV ? '/api' : 'http://127.0.0.1:5000');

/** Human-readable message for failed requests (axios "Network Error" is unhelpful alone). */
export function apiErrorMessage(error) {
  const d = error?.response?.data;
  if (d && typeof d.message === 'string') return d.message;
  if (d && typeof d.error === 'string') return d.error;
  const code = error?.code;
  const msg = error?.message || '';
  if (code === 'ERR_NETWORK' || msg === 'Network Error') {
    return 'Cannot reach the Flask API. From the project root, run the backend (e.g. `python backend/app.py` or your usual command) so it listens on port 5000, then reload this page.';
  }
  return msg || String(error);
}

export const predictWastage = async (payload) => {
  const res = await axios.post(`${BASE}/predict`, payload);
  return res.data;
};

export const getRooms = async () => {
  const res = await axios.get(`${BASE}/rooms`);
  return res.data;
};

export const getHealth = async () => {
  const res = await axios.get(`${BASE}/health`);
  return res.data;
};

export const getHistory = async (limit = 500) => {
  const res = await axios.get(`${BASE}/history`, { params: { limit } });
  return res.data;
};

export const getCumulative = async () => {
  const res = await axios.get(`${BASE}/analytics/cumulative`);
  return res.data;
};

export const getAnalyticsSummary = async () => {
  const res = await axios.get(`${BASE}/analytics/summary`);
  return res.data;
};

export const getRecipientSettings = async () => {
  const res = await axios.get(`${BASE}/settings/recipients`);
  return res.data;
};

/** @param {string[]} recipients */
export const putRecipientSettings = async (recipients) => {
  const res = await axios.put(`${BASE}/settings/recipients`, { recipients });
  return res.data;
};
