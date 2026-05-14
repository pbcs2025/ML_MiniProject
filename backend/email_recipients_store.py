"""Optional override for alert recipient emails (supports multiple addresses).

If ``data/email_recipients.json`` exists with a non-empty ``recipients`` list,
those addresses are used instead of RECIPIENT_EMAIL / STAFF_EMAIL from .env.

Saving an empty list removes the file so .env is used again.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import List, Optional

_FILENAME = "email_recipients.json"


def _file_path(repo_root: Path) -> Path:
    return repo_root / "data" / _FILENAME


def load_recipients(repo_root: Path) -> Optional[List[str]]:
    """Return list if file defines recipients; None if file absent or invalid (use .env)."""
    path = _file_path(repo_root)
    if not path.is_file():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        lst = data.get("recipients")
        if not isinstance(lst, list):
            return None
        out = [str(x).strip() for x in lst if str(x).strip()]
        return out if out else None
    except (OSError, json.JSONDecodeError, TypeError):
        return None


def save_recipients(repo_root: Path, emails: List[str]) -> None:
    """Persist recipients. Empty list deletes the override file."""
    data_dir = repo_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    path = _file_path(repo_root)
    if not emails:
        if path.exists():
            path.unlink()
        return
    path.write_text(
        json.dumps({"recipients": emails}, indent=2),
        encoding="utf-8",
    )


_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+$")


def normalize_and_validate(raw_list: List[str]) -> tuple[List[str], Optional[str]]:
    """Deduplicate (case-insensitive), validate. Empty list is OK (revert to .env)."""
    seen: set[str] = set()
    out: List[str] = []
    for raw in raw_list:
        s = raw.strip()
        if not s:
            continue
        key = s.lower()
        if key in seen:
            continue
        if not _EMAIL_RE.match(s):
            return [], f"Invalid email address: {raw!r}"
        seen.add(key)
        out.append(s)
    return out, None
