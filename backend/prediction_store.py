"""Prediction history: MongoDB when reachable, else SQLite."""
from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import List, Optional

_sqlite_path: Optional[Path] = None
_mongo_col = None
_backend = "sqlite"


def init_prediction_store(repo_root: Path) -> None:
    global _sqlite_path, _mongo_col, _backend
    data_dir = repo_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    _sqlite_path = data_dir / "predictions.db"
    _ensure_sqlite_schema()

    _mongo_col = None
    _backend = "sqlite"
    if os.environ.get("USE_MONGODB", "1").lower() in ("0", "false", "no"):
        return
    try:
        from pymongo import MongoClient

        uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
        client = MongoClient(uri, serverSelectionTimeoutMS=2500)
        client.admin.command("ping")
        _mongo_col = client["energy_optimizer"]["predictions"]
        _backend = "mongo"
    except Exception:
        _mongo_col = None
        _backend = "sqlite"


def store_backend() -> str:
    return _backend


def _ensure_sqlite_schema() -> None:
    conn = sqlite3.connect(_sqlite_path)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT NOT NULL,
            wastage_predicted INTEGER NOT NULL,
            confidence REAL NOT NULL,
            devices_on TEXT NOT NULL,
            power_w REAL NOT NULL,
            recommendation TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            savings_kwh REAL NOT NULL,
            savings_co2 REAL NOT NULL
        )"""
    )
    conn.commit()
    conn.close()


def save_prediction(result: dict, data: dict) -> None:
    savings = result.get("savings") or {}
    kwh = float(savings.get("kwh_if_switched_off") or 0)
    co2 = float(savings.get("co2_kg_avoided") or 0)
    try:
        pw = float(data.get("power_consumption_w", 0) or 0)
    except (TypeError, ValueError):
        pw = 0.0
    doc = {
        "room_id": result.get("room_id"),
        "wastage_predicted": int(result.get("wastage_predicted", 0)),
        "confidence": float(result.get("confidence") or 0),
        "devices_on": result.get("devices_on") or [],
        "power_w": pw,
        "recommendation": str(result.get("recommendation") or ""),
        "timestamp": datetime.now().isoformat(),
        "savings_kwh": kwh,
        "savings_co2": co2,
    }
    if _mongo_col is not None:
        _mongo_col.insert_one(doc)
        return
    conn = sqlite3.connect(_sqlite_path)
    conn.execute(
        """INSERT INTO predictions
           (room_id, wastage_predicted, confidence, devices_on, power_w,
            recommendation, timestamp, savings_kwh, savings_co2)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (
            doc["room_id"],
            doc["wastage_predicted"],
            doc["confidence"],
            json.dumps(doc["devices_on"]),
            doc["power_w"],
            doc["recommendation"],
            doc["timestamp"],
            doc["savings_kwh"],
            doc["savings_co2"],
        ),
    )
    conn.commit()
    conn.close()


def _row_to_dict(row: tuple) -> dict:
    (
        _id,
        room_id,
        wastage_predicted,
        confidence,
        devices_on,
        power_w,
        recommendation,
        timestamp,
        savings_kwh,
        savings_co2,
    ) = row
    dev = json.loads(devices_on) if isinstance(devices_on, str) else devices_on
    return {
        "room_id": room_id,
        "wastage_predicted": int(wastage_predicted),
        "confidence": float(confidence),
        "devices_on": dev,
        "power_w": float(power_w),
        "recommendation": recommendation,
        "timestamp": timestamp,
        "savings_kwh": float(savings_kwh),
        "savings_co2": float(savings_co2),
    }


def get_history(limit: int = 500) -> List[dict]:
    lim = max(1, min(int(limit), 2000))
    if _mongo_col is not None:
        cur = _mongo_col.find({}, {"_id": 0}).sort("timestamp", -1).limit(lim)
        return [dict(d) for d in cur]
    conn = sqlite3.connect(_sqlite_path)
    rows = conn.execute(
        "SELECT * FROM predictions ORDER BY id DESC LIMIT ?",
        (lim,),
    ).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_cumulative_stats() -> dict:
    if _mongo_col is not None:
        pipe = [
            {"$match": {"wastage_predicted": 1}},
            {
                "$group": {
                    "_id": None,
                    "kwh": {"$sum": "$savings_kwh"},
                    "co2": {"$sum": "$savings_co2"},
                    "n": {"$sum": 1},
                }
            },
        ]
        agg = list(_mongo_col.aggregate(pipe))
        if not agg:
            return {"kwh_saved": 0.0, "co2_kg": 0.0, "wastage_events": 0}
        a = agg[0]
        return {
            "kwh_saved": round(float(a.get("kwh") or 0), 4),
            "co2_kg": round(float(a.get("co2") or 0), 4),
            "wastage_events": int(a.get("n") or 0),
        }
    conn = sqlite3.connect(_sqlite_path)
    row = conn.execute(
        """SELECT COALESCE(SUM(savings_kwh),0), COALESCE(SUM(savings_co2),0), COUNT(*)
           FROM predictions WHERE wastage_predicted = 1"""
    ).fetchone()
    conn.close()
    if not row:
        return {"kwh_saved": 0.0, "co2_kg": 0.0, "wastage_events": 0}
    return {
        "kwh_saved": round(float(row[0] or 0), 4),
        "co2_kg": round(float(row[1] or 0), 4),
        "wastage_events": int(row[2] or 0),
    }
