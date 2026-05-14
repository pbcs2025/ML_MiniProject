def build_recommendation(data: dict, pred: int, room: str, is_break: int, conf: float) -> str:
    if pred == 0:
        return 'All devices running optimally. No action needed.'
    ctx = 'during break period' if is_break else 'with no occupancy detected'
    devices = []
    if data.get('fan_status'):
        devices.append('Fan')
    if data.get('light_status'):
        devices.append('Light')
    if data.get('ac_status'):
        devices.append('AC')
    if data.get('projector_status'):
        devices.append('Projector')
    dev_str = ', '.join(devices) if devices else 'devices'
    return (
        f'{room}: {dev_str} running {ctx}. '
        f'Confidence {conf}%. Switch off immediately.'
    )
