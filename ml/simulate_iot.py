import os
import random
from datetime import datetime, timedelta

import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

ROOMS = ['Class1', 'Class2', 'Class3', 'Lab1', 'Lab2', 'StaffRoom']
POWER = {'fan': 120, 'light': 60, 'ac': 0, 'projector': 300}

OCC_PROB = {
    8: 0.6, 9: 0.9, 10: 0.85, 11: 0.15,
    12: 0.88, 13: 0.1, 14: 0.1,
    15: 0.85, 16: 0.75, 17: 0.4,
}

DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


def _format_time_slot(hour: int) -> str:
    if hour == 0:
        h12, suf = 12, 'AM'
    elif hour < 12:
        h12, suf = hour, 'AM'
    elif hour == 12:
        h12, suf = 12, 'PM'
    else:
        h12, suf = hour - 12, 'PM'
    return f'{h12}:00 {suf}'


records = []
start = datetime(2026, 2, 2, 8, 0)

for day in range(30):
    d = start + timedelta(days=day)
    if d.weekday() > 5:
        continue
    day_name = DAYS[d.weekday()]
    for hour in range(8, 18):
        time_slot = _format_time_slot(hour)
        for room in ROOMS:
            is_break_period = 1 if hour in [10, 13] else 0
            is_after_hours = 1 if hour >= 17 else 0
            occ_p = OCC_PROB.get(hour, 0.5)
            occupancy = random.choices([1, 0], weights=[occ_p, 1 - occ_p])[0]
            fan = random.choices([1, 0], weights=[0.9, 0.1] if occupancy else [0.35, 0.65])[0]
            light = random.choices([1, 0], weights=[0.85, 0.15] if occupancy else [0.3, 0.7])[0]
            ac = 0
            proj = 0 if room == 'StaffRoom' else random.choices(
                [1, 0], weights=[0.5, 0.5] if occupancy else [0.25, 0.75]
            )[0]
            power = POWER['fan'] * fan + POWER['light'] * light + POWER['projector'] * proj
            power += random.randint(-10, 10)
            power = max(0, power)
            wastage = 1 if (not occupancy) and (fan or light or proj) else 0
            records.append([
                d.strftime('%d-%m-%Y'), time_slot, room,
                occupancy, fan, light, ac, proj, power,
                day_name, is_break_period, is_after_hours, wastage,
            ])

cols = [
    'date', 'time_slot', 'room_id', 'occupancy', 'fan_status', 'light_status',
    'ac_status', 'projector_status', 'power_consumption_w', 'day_of_week',
    'is_break_period', 'is_after_hours', 'wastage_label',
]

df = pd.DataFrame(records, columns=cols)
os.makedirs('data/simulated', exist_ok=True)
df.to_csv('data/simulated/virtual_iot_data.csv', index=False)
print(f'Generated {len(df)} synthetic rows')
print(f'Wastage rate: {df.wastage_label.mean() * 100:.1f}%')
