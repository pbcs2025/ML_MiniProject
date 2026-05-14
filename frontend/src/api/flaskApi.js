import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export const getAnalyticsSummary = async () => {
  const res = await axios.get(`${BASE}/analytics/summary`);
  return res.data;
};
