import os
from datetime import datetime

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from predict import build_prediction
from notify import alert_recipient_preview, send_wastage_alert

app = Flask(__name__)
CORS(app)

ROOMS = ['Class1', 'Class2', 'Class3', 'Lab1', 'Lab2', 'StaffRoom']
_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@app.route('/rooms', methods=['GET'])
def get_rooms():
    return jsonify(ROOMS)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}
    result = build_prediction(data)

    if result['wastage_predicted'] == 1:
        mail = send_wastage_alert(
            room_id=data.get('room_id', result['room_id']),
            devices_on=result['devices_on'],
            power_w=data.get('power_consumption_w', 0),
            confidence=result['confidence'],
        )
        result['alert_email'] = mail

    return jsonify(result)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'alert_recipient_configured': bool(alert_recipient_preview()),
        'alert_recipient_masked': alert_recipient_preview(),
    })


@app.route('/analytics/summary', methods=['GET'])
def analytics_summary():
    """Aggregate wastage counts from manual observations for charts."""
    raw_path = os.path.join(_REPO, 'data', 'raw', 'manual_data.csv')
    if not os.path.isfile(raw_path):
        return jsonify({'error': 'manual_data.csv not found'}), 404
    df = pd.read_csv(raw_path)
    w = df[df['wastage_label'] == 1]
    by_room = {r: int((w['room_id'] == r).sum()) for r in ROOMS}
    by_time = w.groupby('time_slot').size().sort_index().to_dict()
    by_time = {str(k): int(v) for k, v in by_time.items()}
    by_day = w.groupby('day_of_week').size().to_dict()
    by_day = {str(k): int(v) for k, v in by_day.items()}

    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    day_index = {d: i for i, d in enumerate(day_order)}
    col_labels = [f'{h}:00' for h in range(8, 15)]
    matrix = [[0] * 7 for _ in range(6)]

    def parse_hour_slot(ts):
        s = str(ts).strip()
        for fmt in ('%I:%M %p', '%I:%M%p', '%H:%M'):
            try:
                return datetime.strptime(s, fmt).hour
            except ValueError:
                continue
        t = pd.to_datetime(s, errors='coerce')
        if pd.notna(t):
            return int(t.hour)
        return 12

    for _, row in w.iterrows():
        d = row.get('day_of_week')
        if d not in day_index:
            continue
        hr = parse_hour_slot(row.get('time_slot', ''))
        col = min(max(hr - 8, 0), 6)
        matrix[day_index[d]][col] += 1

    return jsonify({
        'by_room': by_room,
        'by_time_slot': by_time,
        'by_day_of_week': by_day,
        'heatmap': {'matrix': matrix, 'row_labels': day_order, 'col_labels': col_labels},
        'total_rows': int(len(df)),
        'wastage_rows': int(len(w)),
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
