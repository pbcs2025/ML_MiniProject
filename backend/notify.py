import html
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


def _esc(s: object) -> str:
    return html.escape(str(s), quote=True)


def _build_alert_plain(room_id: str, devices_on: list, confidence: float, kwh: float) -> str:
    lines = ', '.join(str(d) for d in devices_on) if devices_on else '—'
    return (
        f'Wastage detected - {room_id}\n\n'
        f'Room: {room_id}\n'
        f'Devices on: {lines}\n'
        f'Model confidence: {float(confidence):.1f}%\n'
        f'Potential saving: {kwh:.3f} kWh if load is removed now.\n\n'
        f'Please check {room_id} and switch off equipment that is not needed.\n\n'
        f'Smart Energy Optimizer\n'
    )


def _build_alert_html(room_id: str, devices_on: list, confidence: float, kwh: float) -> str:
    room = _esc(room_id)
    if devices_on:
        devices_rows = ''.join(
            f'<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-family:Inter,Segoe UI,sans-serif;font-size:14px;color:#334155;">{_esc(d)}</td></tr>'
            for d in devices_on
        )
    else:
        devices_rows = (
            '<tr><td style="padding:10px 14px;font-family:Inter,Segoe UI,sans-serif;font-size:14px;color:#64748b;">—</td></tr>'
        )
    conf = _esc(f'{float(confidence):.1f}')
    kwh_s = _esc(f'{kwh:.3f}')
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Inter,Segoe UI,system-ui,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background-color:#0f172a;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:12px 12px 0 0;padding:22px 24px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Smart Energy Optimizer</p>
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#f8fafc;line-height:1.3;">Wastage detected</h1>
        <p style="margin:10px 0 0;font-size:15px;color:#bae6fd;">Room <strong style="color:#fff;">{room}</strong></p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:0;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <p style="margin:0;padding:16px 18px 8px;font-size:13px;color:#64748b;line-height:1.5;">
          The model flagged possible energy wastage for the state below. Please verify the room and switch off anything that should not be running.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr style="background:#f8fafc;">
            <td style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e2e8f0;">Devices currently on</td>
          </tr>
          {devices_rows}
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:4px;">
          <tr>
            <td style="padding:12px 14px;width:45%;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">Confidence</td>
            <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#0f172a;border-top:1px solid #e2e8f0;">{conf}%</td>
          </tr>
          <tr>
            <td style="padding:12px 14px;font-size:13px;color:#64748b;border-top:1px solid #f1f5f9;">Potential saving</td>
            <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#047857;border-top:1px solid #f1f5f9;">{kwh_s} kWh <span style="font-size:12px;font-weight:500;color:#64748b;">if switched off now</span></td>
          </tr>
        </table>
        <div style="padding:18px 18px 22px;">
          <p style="margin:0 0 14px;font-size:14px;color:#334155;line-height:1.55;">
            Please visit <strong style="color:#0f172a;">{room}</strong> and remove unnecessary load when safe to do so.
          </p>
          <p style="margin:0;font-size:12px;color:#94a3b8;">This message was sent automatically by your campus energy monitoring workflow.</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>"""


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
    subject = f'Wastage detected - {room_id} | Smart Energy Optimizer'
    body_plain = _build_alert_plain(room_id, devices_on, confidence, kwh)
    body_html = _build_alert_html(room_id, devices_on, confidence, kwh)
    msg = MIMEMultipart('alternative')
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)
    msg['Subject'] = subject
    msg.attach(MIMEText(body_plain, 'plain', 'utf-8'))
    msg.attach(MIMEText(body_html, 'html', 'utf-8'))
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
