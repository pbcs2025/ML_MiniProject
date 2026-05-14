import os
from datetime import datetime

import numpy as np
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


def parse_hour(ts) -> int:
    s = str(ts).strip()
    for fmt in ('%I:%M %p', '%I:%M%p', '%H:%M'):
        try:
            return datetime.strptime(s, fmt).hour
        except ValueError:
            continue
    parsed = pd.to_datetime(s, errors='coerce')
    if pd.notna(parsed):
        return int(parsed.hour)
    return 9


df1 = pd.read_csv('data/raw/manual_data.csv')
df2 = pd.read_csv('data/simulated/virtual_iot_data.csv')
df = pd.concat([df1, df2], ignore_index=True)

df['hour'] = df['time_slot'].apply(parse_hour)
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

day_map = {
    'Monday': 0, 'Tuesday': 1, 'Wednesday': 2,
    'Thursday': 3, 'Friday': 4, 'Saturday': 5,
}
df['day_num'] = df['day_of_week'].map(day_map).fillna(0).astype(int)

df = pd.get_dummies(df, columns=['room_id'], prefix='room')

df.drop(columns=['date', 'time_slot', 'day_of_week', 'hour'], inplace=True)
df.drop_duplicates(inplace=True)
df.dropna(inplace=True)

os.makedirs('data/processed', exist_ok=True)
df.to_csv('data/processed/final_dataset.csv', index=False)
print(f'Final dataset: {df.shape[0]} rows, {df.shape[1]} columns')
print(f'Wastage rate: {df.wastage_label.mean() * 100:.1f}%')
