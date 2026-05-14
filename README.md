# Smart Energy Optimizer

ML-powered energy wastage detection for college rooms: Random Forest on merged manual + synthetic data, Flask API, React dashboard with animated room view.

## Prerequisites

- Python 3.10+
- Node.js 18+

## Setup

```powershell
cd smart-energy-optimizer
python -m venv venv
.\venv\Scripts\activate
pip install -r backend/requirements.txt
```

Place campus observations at `data/raw/manual_data.csv` (ignored by git). The repository workflow assumes this file exists locally after clone.

## ML pipeline (run from repo root `smart-energy-optimizer/`)

```powershell
python ml/simulate_iot.py
python ml/preprocess.py
python ml/train_model.py
python ml/evaluate_model.py
```

Outputs: `data/simulated/virtual_iot_data.csv`, `data/processed/final_dataset.csv`, `ml/model.pkl`, `ml/feature_columns.pkl`.

## Backend

```powershell
cd backend
python app.py
```

API: `http://localhost:5000` — `GET /health`, `GET /rooms`, `POST /predict`, `GET /analytics/summary`, `GET /history?limit=…`, `GET /analytics/cumulative`, `GET/PUT /settings/recipients`. Prediction history uses MongoDB when available, otherwise SQLite at `data/predictions.db`.

### Alert recipients (multiple addresses)

- **Settings page** in the app (`/settings`): save one or more recipient emails without editing `.env`. Stored in `data/email_recipients.json` (gitignored). **Use .env only** removes that file and restores `RECIPIENT_EMAIL` / `STAFF_EMAIL`.
- **Or** set `RECIPIENT_EMAIL=a@x.com,b@y.com` (comma-separated) in `.env`. Sender credentials remain `ALERT_EMAIL` / `ALERT_PASSWORD`.

### Email alerts (Gmail App Password)

1. Copy [`.env.example`](.env.example) to `.env` in the **project root** (`smart-energy-optimizer/.env`).
2. Set:
   - `ALERT_EMAIL` — sender Gmail
   - `ALERT_PASSWORD` — Gmail **App Password** (not your normal login password)
   - `RECIPIENT_EMAIL` — who receives wastage alerts

Legacy names `SMTP_USER` / `SMTP_PASS` / `STAFF_EMAIL` still work if `ALERT_*` / `RECIPIENT_EMAIL` are empty.

`GET /health` returns `alert_recipient_masked` when a recipient is configured. After `POST /predict`, wastage responses include `alert_email`: `{ sent, recipient_masked, error, message }`.

## Jupyter notebooks (EDA, training, metrics)

From repo root, with the same venv and `pip install -r backend/requirements.txt` plus:

```powershell
pip install jupyter ipykernel seaborn
```

Then:

```powershell
jupyter notebook notebooks
```

| Notebook | Purpose |
|----------|---------|
| [`notebooks/01_dataset_overview.ipynb`](notebooks/01_dataset_overview.ipynb) | Load manual + simulated CSVs, schema, class balance, room/time summaries |
| [`notebooks/02_model_training.ipynb`](notebooks/02_model_training.ipynb) | Train/test split, Random Forest, save `model.pkl` / `feature_columns.pkl` (same logic as `ml/train_model.py`) |
| [`notebooks/03_evaluation_metrics.ipynb`](notebooks/03_evaluation_metrics.ipynb) | Confusion matrix, report, ROC-AUC, feature importances |

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite dev server: `npm run dev` (default `http://localhost:5173`). Set `VITE_API_URL` if the API is not on `http://localhost:5000`. Ensure Flask is running for live predictions.

## Optional: log new observations

```powershell
python ml/collect_data.py
```

Appends one row to `data/raw/manual_data.csv`.
