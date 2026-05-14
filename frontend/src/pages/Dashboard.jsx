import { useEffect, useMemo, useState } from 'react';
import { predictWastage, getRooms, getHealth } from '../api/flaskApi.js';
import RoomSelector from '../components/RoomSelector.jsx';
import DevicePanel from '../components/DevicePanel.jsx';
import PredictionCard from '../components/PredictionCard.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';
import SavingsCounter from '../components/SavingsCounter.jsx';

const initialDevices = { fan: 0, light: 0, ac: 0, projector: 0 };

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('Lab1');
  const [occupancy, setOccupancy] = useState(1);
  const [devices, setDevices] = useState(initialDevices);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kwhTotal, setKwhTotal] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [lastStatus, setLastStatus] = useState({});
  const [alertRecipientMasked, setAlertRecipientMasked] = useState(null);
  const [lastAlertSummary, setLastAlertSummary] = useState('');

  useEffect(() => {
    getRooms().then((r) => {
      setRooms(r);
      if (r.length && !r.includes(selectedRoom)) setSelectedRoom(r[0]);
    });
    getHealth()
      .then((h) => setAlertRecipientMasked(h.alert_recipient_masked || null))
      .catch(() => setAlertRecipientMasked(null));
  }, []);

  useEffect(() => {
    if (selectedRoom === 'StaffRoom') {
      setDevices((d) => ({ ...d, projector: 0 }));
    }
  }, [selectedRoom]);

  const powerUsage = useMemo(() => {
    const p =
      selectedRoom === 'StaffRoom'
        ? devices.fan * 120 + devices.light * 60 + devices.ac * 1500
        : devices.fan * 120 +
          devices.light * 60 +
          devices.ac * 1500 +
          devices.projector * 300;
    return p;
  }, [devices, selectedRoom]);

  const showWastageTint = prediction?.wastage_predicted === 1;

  const onToggle = (key) => {
    setDevices((d) => ({ ...d, [key]: d[key] ? 0 : 1 }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
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
        const slot = 0.25;
        setKwhTotal((t) => t + powerUsage / 1000 * slot);
        setAlertsCount((c) => c + 1);
      }
    } catch (e) {
      console.error(e);
      setPrediction({
        wastage_predicted: 0,
        confidence: 0,
        room_id: selectedRoom,
        recommendation: 'API error — is Flask running on port 5000?',
      });
    } finally {
      setLoading(false);
    }
  };

  const co2 = kwhTotal * 0.82;

  return (
    <div className="max-h-[100dvh] overflow-hidden flex flex-col px-3 pb-3">
      <RoomSelector
        rooms={rooms.length ? rooms : ['Class1', 'Lab1', 'StaffRoom']}
        selected={selectedRoom}
        onSelect={setSelectedRoom}
        lastStatus={lastStatus}
      />
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 mt-1">
        <div className="lg:col-span-2 min-h-0 min-w-0">
          <DevicePanel
            roomId={selectedRoom}
            occupancy={occupancy}
            onOccupancyChange={setOccupancy}
            devices={devices}
            onToggle={onToggle}
            showWastageTint={showWastageTint}
          />
        </div>
        <div className="flex flex-col gap-2 min-h-0">
          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="rounded-lg bg-[#003d52] hover:bg-[#005a77] text-white font-orbitron text-sm py-2 border border-[#00e5ff55] disabled:opacity-50"
          >
            {loading ? 'RUNNING ML…' : 'RUN ML PREDICTION'}
          </button>
          <div className="text-[10px] text-center text-gray-500">
            Live load (for API): {powerUsage}W
          </div>
          {prediction && (
            <>
              <PredictionCard result={prediction} />
              <RecommendationCard text={prediction.recommendation} />
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 mt-2">
        <SavingsCounter
          kwh={kwhTotal}
          co2={co2}
          alerts={alertsCount}
          alertRecipientMasked={alertRecipientMasked}
          lastAlertSummary={lastAlertSummary}
        />
      </div>
    </div>
  );
}
