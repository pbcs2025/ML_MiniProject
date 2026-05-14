import { useCallback, useEffect, useMemo, useState } from 'react';
import { predictWastage, getRooms, getHealth, getHistory, getCumulative } from '../api/flaskApi.js';
import DashboardHero from '../components/DashboardHero.jsx';
import RoomSelector from '../components/RoomSelector.jsx';
import PIROccupancyCard from '../components/PIROccupancyCard.jsx';
import LiveLoadBattery from '../components/LiveLoadBattery.jsx';
import DevicePanel from '../components/DevicePanel.jsx';
import PredictionCard from '../components/PredictionCard.jsx';
import AwaitingInferenceCard from '../components/AwaitingInferenceCard.jsx';
import SavingsCounter from '../components/SavingsCounter.jsx';
import RecentPredictionsLog from '../components/RecentPredictionsLog.jsx';

const initialDevices = { fan: 0, light: 0, ac: 0, projector: 0 };
const HISTORY_LIMIT = 2000;

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('Class1');
  const [occupancy, setOccupancy] = useState(1);
  const [devices, setDevices] = useState(initialDevices);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [cumulative, setCumulative] = useState(null);
  const [kwhSession, setKwhSession] = useState(0);
  const [alertsSession, setAlertsSession] = useState(0);
  const [lastStatus, setLastStatus] = useState({});
  const [alertRecipientMasked, setAlertRecipientMasked] = useState(null);
  const [emailConfigured, setEmailConfigured] = useState(false);

  const refreshHistory = useCallback(() => {
    getHistory(HISTORY_LIMIT)
      .then(setHistory)
      .catch(() => setHistory([]));
    getCumulative()
      .then(setCumulative)
      .catch(() => setCumulative(null));
  }, []);

  useEffect(() => {
    getRooms().then((r) => {
      setRooms(r);
      if (r.length && !r.includes(selectedRoom)) setSelectedRoom(r[0]);
    });
    getHealth()
      .then((h) => {
        setAlertRecipientMasked(h.alert_recipient_masked || null);
        setEmailConfigured(!!h.alert_recipient_configured);
      })
      .catch(() => {
        setAlertRecipientMasked(null);
        setEmailConfigured(false);
      });
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    const id = setInterval(refreshHistory, 30000);
    return () => clearInterval(id);
  }, [refreshHistory]);

  useEffect(() => {
    if (selectedRoom === 'StaffRoom') {
      setDevices((d) => ({ ...d, projector: 0 }));
    }
  }, [selectedRoom]);

  const handleSelectRoom = (id) => {
    setSelectedRoom(id);
    setOccupancy(1);
    setDevices({ ...initialDevices });
    setPrediction(null);
  };

  const powerUsage = useMemo(() => {
    const staff = selectedRoom === 'StaffRoom';
    return (
      devices.fan * 120 +
      devices.light * 60 +
      devices.ac * 1500 +
      (staff ? 0 : devices.projector * 300)
    );
  }, [devices, selectedRoom]);

  const showWastageTint = prediction?.wastage_predicted === 1;

  const onToggle = (key) => {
    setDevices((d) => ({ ...d, [key]: d[key] ? 0 : 1 }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const payload = {
        room_id: selectedRoom,
        occupancy,
        fan_status: devices.fan,
        light_status: devices.light,
        ac_status: devices.ac,
        projector_status: selectedRoom === 'StaffRoom' ? 0 : devices.projector,
        power_consumption_w: powerUsage,
      };
      const result = await predictWastage(payload);
      setPrediction(result);
      setLastStatus((m) => ({
        ...m,
        [selectedRoom]: result.wastage_predicted === 1 ? 'wastage' : 'optimal',
      }));
      if (result.wastage_predicted === 1) {
        setKwhSession((t) => t + (powerUsage / 1000) * 0.25);
        setAlertsSession((c) => c + 1);
      }
      refreshHistory();
    } catch (e) {
      console.error(e);
      setPrediction({
        wastage_predicted: 0,
        confidence: 0,
        room_id: selectedRoom,
        is_break: 0,
        recommendation: 'API error — is Flask running on port 5000?',
        savings: { kwh_if_switched_off: 0, co2_kg_avoided: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const co2Session = kwhSession * 0.82;
  const kwhDisplay = cumulative?.kwh_saved != null ? cumulative.kwh_saved : kwhSession;
  const co2Display = cumulative?.co2_kg != null ? cumulative.co2_kg : co2Session;
  const alertsDisplay = cumulative?.wastage_events != null ? cumulative.wastage_events : alertsSession;

  const roomList = rooms.length ? rooms : ['Class1', 'Class2', 'Class3', 'Lab1', 'Lab2', 'StaffRoom'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardHero />

      <div className="mx-auto max-w-[min(100%,90rem)] px-4 py-6 md:px-6 lg:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
          <aside className="mb-8 w-full min-w-0 shrink-0 space-y-4 lg:sticky lg:top-[4.75rem] lg:mb-0 lg:w-1/2 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
            <RoomSelector rooms={roomList} selected={selectedRoom} onSelect={handleSelectRoom} lastStatus={lastStatus} />
            <DevicePanel
              roomId={selectedRoom}
              occupancy={occupancy}
              onOccupancyChange={setOccupancy}
              devices={devices}
              onToggle={onToggle}
              showWastageTint={showWastageTint}
              showCornerPir={false}
            />
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
              <LiveLoadBattery powerW={powerUsage} />
              <PIROccupancyCard roomName={selectedRoom} occupancy={occupancy} onChange={setOccupancy} />
            </div>
            <button
              type="button"
              onClick={handlePredict}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-display text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <svg className="h-5 w-5 shrink-0 opacity-90" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
              </svg>
              {loading ? 'Analysing…' : 'Run ML prediction'}
            </button>
          </aside>

          <main className="min-w-0 w-full space-y-5 lg:w-1/2">
            {prediction ? (
              <PredictionCard
                result={prediction}
                powerW={powerUsage}
                occupancy={occupancy}
                emailConfigured={emailConfigured}
              />
            ) : (
              <AwaitingInferenceCard />
            )}
            <SavingsCounter
              kwh={kwhDisplay}
              co2={co2Display}
              alerts={alertsDisplay}
              alertRecipientMasked={alertRecipientMasked}
              showEmailFooter={false}
            />
            <RecentPredictionsLog entries={history} />
          </main>
        </div>
      </div>
    </div>
  );
}
