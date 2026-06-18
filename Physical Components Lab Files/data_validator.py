# Data validation module - Ensures sensor readings are valid
import hashlib
from ubinascii import hexlify
from machine import unique_id

# Validation thresholds
TEMP_MIN = -10
TEMP_MAX = 60
HUMIDITY_MIN = 0
HUMIDITY_MAX = 100
PH_MIN = 0
PH_MAX = 14
MOISTURE_MIN = 0
MOISTURE_MAX = 100

# Device secret for integrity checks
DEVICE_SECRET = hexlify(unique_id()).decode()


def validate_sensor_data(temp, humidity, moisture, ph):
    """Validate sensor readings are within acceptable ranges"""
    errors = []
    
    if temp is not None and (temp < TEMP_MIN or temp > TEMP_MAX):
        errors.append(f"⚠ Temp out of range: {temp}°C")
    
    if humidity is not None and (humidity < HUMIDITY_MIN or humidity > HUMIDITY_MAX):
        errors.append(f"⚠ Humidity out of range: {humidity}%")
    
    if moisture is not None and (moisture < MOISTURE_MIN or moisture > MOISTURE_MAX):
        errors.append(f"⚠ Moisture out of range: {moisture}%")
    
    if ph is not None and (ph < PH_MIN or ph > PH_MAX):
        errors.append(f"⚠ pH out of range: {ph}")
    
    return len(errors) == 0, errors


def compute_checksum(data_dict):
    """Compute checksum for data integrity verification"""
    try:
        import ujson
        data_str = ujson.dumps(data_dict, sort_keys=True)
        combined = data_str + DEVICE_SECRET
        h = hashlib.sha256(combined.encode())
        return hexlify(h.digest()).decode()[:16]
    except Exception as e:
        print("Checksum error:", e)
        return None


def add_metadata(payload):
    """Add device ID, checksum, and validation status to payload"""
    payload["device_id"] = hexlify(unique_id()).decode()
    payload["checksum"] = compute_checksum(payload)
    
    temp = payload.get("dht22_temp")
    humidity = payload.get("dht22_humidity")
    moisture = payload.get("moisture_percent")
    ph = payload.get("ph")
    
    is_valid, errors = validate_sensor_data(temp, humidity, moisture, ph)
    payload["valid"] = is_valid
    
    if not is_valid:
        for error in errors:
            print(error)
    
    return payload
