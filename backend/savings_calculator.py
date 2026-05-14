def compute_savings(power_w: float, slot_hours: float = 0.25) -> dict:
    """Potential kWh if load is removed for one slot; CO2 factor 0.82 kg/kWh."""
    kwh = float(power_w) / 1000.0 * slot_hours
    co2_kg = kwh * 0.82
    return {
        'kwh_if_switched_off': round(kwh, 4),
        'co2_kg_avoided': round(co2_kg, 4),
    }
