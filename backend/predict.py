import os

import joblib
import numpy as np
import pandas as pd
from datetime import datetime

from recommendations import build_recommendation
from savings_calculator import compute_savings

_BASE = os.path.dirname(os.path.abspath(__file__))
_REPO = os.path.dirname(_BASE)
model = joblib.load(os.path.join(_REPO, 'ml', 'model.pkl'))
FEATURES = joblib.load(os.path.join(_REPO, 'ml', 'feature_columns.pkl'))

ROOMS = ['Class1', 'Class2', 'Class3', 'Lab1', 'Lab2', 'StaffRoom']


def _power(data: dict) -> float:
    try:
        return float(data.get('power_consumption_w', 0) or 0)
    except (TypeError, ValueError):
        return 0.0


def build_prediction(data: dict) -> dict:
    now = datetime.now()
    hour = now.hour
    is_break = 1 if (10 <= hour < 11) or (13 <= hour < 14) else 0
    is_after = 1 if hour >= 17 else 0

    pw = _power(data)

    row = {
        'occupancy': int(data.get('occupancy', 0)),
        'fan_status': int(data.get('fan_status', 0)),
        'light_status': int(data.get('light_status', 0)),
        'ac_status': int(data.get('ac_status', 0)),
        'projector_status': int(data.get('projector_status', 0)),
        'power_consumption_w': pw,
        'is_break_period': is_break,
        'is_after_hours': is_after,
        'day_num': now.weekday() if now.weekday() <= 5 else 5,
        'hour_sin': np.sin(2 * np.pi * hour / 24),
        'hour_cos': np.cos(2 * np.pi * hour / 24),
    }

    room = data.get('room_id', 'Class1')
    if room not in ROOMS:
        room = 'Class1'
    for r in ROOMS:
        row[f'room_{r}'] = 1 if r == room else 0

    frame = pd.DataFrame([row])
    frame = frame.reindex(columns=FEATURES, fill_value=0)

    pred = int(model.predict(frame)[0])
    prob = float(model.predict_proba(frame)[0][1])
    conf = round(prob * 100, 1)

    devices_on = []
    if data.get('fan_status'):
        devices_on.append('Fan (120W)')
    if data.get('light_status'):
        devices_on.append('Light (60W)')
    if data.get('ac_status'):
        devices_on.append('AC (1500W)')
    if data.get('projector_status'):
        devices_on.append('Projector (300W)')

    savings = compute_savings(pw)

    return {
        'wastage_predicted': pred,
        'confidence': conf,
        'room_id': room,
        'is_break': is_break,
        'devices_on': devices_on,
        'recommendation': build_recommendation(data, pred, room, is_break, conf),
        'savings': savings,
        'alert_attempted': pred == 1,
    }
