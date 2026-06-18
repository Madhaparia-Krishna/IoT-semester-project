# Offline storage module - Buffers data when WiFi is down
import ujson

OFFLINE_DATA_FILE = "offline_data.json"
MAX_OFFLINE_RECORDS = 100


def load_offline_data():
    """Load stored offline data from flash"""
    try:
        with open(OFFLINE_DATA_FILE, 'r') as f:
            data = ujson.load(f)
            print(f"📦 Loaded {len(data)} offline records")
            return data
    except:
        return []


def save_offline_data(data):
    """Save data to flash storage"""
    try:
        with open(OFFLINE_DATA_FILE, 'w') as f:
            ujson.dump(data, f)
        return True
    except Exception as e:
        print("Save offline error:", e)
        return False


def add_offline_record(payload):
    """Add a record to offline storage with circular buffer"""
    try:
        data = load_offline_data()
        data.append(payload)
        
        # Circular buffer: remove oldest if full
        if len(data) > MAX_OFFLINE_RECORDS:
            data = data[-MAX_OFFLINE_RECORDS:]
            print(f"⚠ Buffer full, trimmed to {MAX_OFFLINE_RECORDS}")
        
        save_offline_data(data)
        print(f"💾 Buffered offline ({len(data)}/{MAX_OFFLINE_RECORDS})")
        return True
    except Exception as e:
        print("Add offline record error:", e)
        return False


def get_offline_count():
    """Get number of buffered records"""
    try:
        data = load_offline_data()
        return len(data)
    except:
        return 0


def clear_synced_records(count):
    """Remove synced records from buffer"""
    try:
        data = load_offline_data()
        remaining = data[count:]
        save_offline_data(remaining)
        print(f"✓ Cleared {count} synced records, {len(remaining)} remain")
        return True
    except Exception as e:
        print("Clear synced error:", e)
        return False
