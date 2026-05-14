import csv
import os
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'data', 'raw', 'manual_data.csv')

HEADERS = [
    'date', 'time_slot', 'room_id', 'occupancy', 'fan_status', 'light_status',
    'ac_status', 'projector_status', 'power_consumption_w', 'day_of_week',
    'is_break_period', 'is_after_hours', 'wastage_label',
]

ROOMS = ['Class1', 'Class2', 'Class3', 'Lab1', 'Lab2', 'StaffRoom']
POWER = {'fan': 120, 'light': 60, 'ac': 1500, 'projector': 300}
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


def yn(prompt: str) -> int:
    return 1 if input(f'{prompt} (y/n): ').strip().lower() == 'y' else 0


def main():
    os.makedirs(os.path.dirname(FILE), exist_ok=True)
    if not os.path.exists(FILE):
        with open(FILE, 'w', newline='', encoding='utf-8') as f:
            csv.writer(f).writerow(HEADERS)

    now = datetime.now()
    hour = now.hour
    is_break_period = 1 if (10 <= hour < 11) or (13 <= hour < 14) else 0
    is_after_hours = 1 if hour >= 17 else 0
    time_slot = now.strftime('%I:%M %p')

    day_name = DAYS[now.weekday()]

    print('\nRooms:', ROOMS)
    room = input('Room ID: ').strip()
    if room not in ROOMS:
        print(f'Warning: {room} not in standard list; still logging.')

    occupancy = yn('Room occupied?')
    fan = yn('Fan ON?')
    light = yn('Light ON?')
    ac = yn('AC ON?')
    projector = yn('Projector ON?')

    power = (
        POWER['fan'] * fan + POWER['light'] * light +
        POWER['ac'] * ac + POWER['projector'] * projector
    )
    wastage = 1 if (not occupancy) and (fan or light or ac or projector) else 0

    row = [
        now.strftime('%d-%m-%Y'),
        time_slot,
        room,
        occupancy, fan, light, ac, projector,
        power,
        day_name,
        is_break_period,
        is_after_hours,
        wastage,
    ]

    with open(FILE, 'a', newline='', encoding='utf-8') as f:
        csv.writer(f).writerow(row)

    status = 'WASTAGE DETECTED' if wastage else 'Normal'
    print(f'\nLogged [{status}] — Power: {power}W — Room: {room}')


if __name__ == '__main__':
    main()
