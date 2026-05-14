import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import List, Optional

try:
    from dotenv import load_dotenv

    _repo = Path(__file__).resolve().parent.parent
    load_dotenv(_repo / '.env')
except ImportError:
    _repo = Path(__file__).resolve().parent.parent

from email_recipients_store import load_recipients

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))


def _sender_email() -> str:
    return (
        os.environ.get('ALERT_EMAIL', '').strip()
        or os.environ.get('SMTP_USER', '').strip()
    )


def _sender_password() -> str:
    return (
        os.environ.get('ALERT_PASSWORD', '').strip()
        or os.environ.get('SMTP_PASS', '').strip()
    )


def _recipients_from_env() -> List[str]:
    raw = (
        os.environ.get('RECIPIENT_EMAIL', '').strip()
        or os.environ.get('STAFF_EMAIL', '').strip()
    )
    if not raw:
        return []
    parts = raw.replace(';', ',').split(',')
    return [p.strip() for p in parts if p.strip()]


def get_recipient_emails() -> List[str]:
    """Active recipient list: saved JSON override if set, else comma-separated .env."""
    saved = load_recipients(_repo)
    if saved:
        return saved
    return _recipients_from_env()


def mask_email(addr: str) -> str:
    if not addr or '@' not in addr:
        return ''
    local, _, domain = addr.partition('@')
    if len(local) <= 2:
        return f'{local[0]}***@{domain}'
    return f'{local[0]}***{local[-1]}@{domain}'


def alert_recipient_preview() -> Optional[str]:
    """Masked summary for health/UI (comma-separated if multiple)."""
    addrs = get_recipient_emails()
    if not addrs:
        return None
    masked = [mask_email(a) for a in addrs]
    return ', '.join(masked)


def alert_recipients_masked_list() -> List[str]:
    return [mask_email(a) for a in get_recipient_emails()]


def send_wastage_alert(room_id: str, devices_on: list, power_w, confidence: float) -> dict:
    sender = _sender_email()
    password = _sender_password()
    recipients = get_recipient_emails()

    if not (sender and password and recipients):
        msg = (
            'Set ALERT_EMAIL, ALERT_PASSWORD, and at least one recipient '
            '(Settings page or RECIPIENT_EMAIL / STAFF_EMAIL in .env)'
        )
        print(f'[notify] Skipped: {msg}')
        return {
            'sent': False,
            'recipient_masked': None,
            'recipients_masked': [],
            'error': 'not_configured',
            'message': msg,
        }

    try:
        pw = float(power_w)
    except (TypeError, ValueError):
        pw = 0.0

    kwh = round(pw / 1000 * 0.25, 3)
    subject = f'[Energy Alert] Wastage Detected in {room_id}'
    body = (
        f'Energy Wastage Alert\n\n'
        f'Room       : {room_id}\n'
        f'Devices ON : {", ".join(devices_on)}\n'
        f'Confidence : {confidence}%\n'
        f'Potential saving : {kwh} kWh if switched off now.\n\n'
        f'Please visit {room_id} and switch off the devices listed above.\n'
        f'— Smart Energy Optimizer System\n'
    )
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    masked = [mask_email(a) for a in recipients]
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, recipients, msg.as_string())
        print(f'[notify] Alert sent -> {", ".join(masked)} for {room_id}')
        return {
            'sent': True,
            'recipient_masked': ', '.join(masked),
            'recipients_masked': masked,
            'error': None,
            'message': None,
        }
    except Exception as e:
        print(f'[notify] Email failed: {e}')
        return {
            'sent': False,
            'recipient_masked': ', '.join(masked),
            'recipients_masked': masked,
            'error': 'send_failed',
            'message': str(e),
        }
