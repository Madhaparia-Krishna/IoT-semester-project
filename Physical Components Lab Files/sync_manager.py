# Sync manager - Handles syncing offline data when connection restored
import time
from offline_storage import load_offline_data, clear_synced_records

SYNC_BATCH_SIZE = 10
last_sync_attempt = 0
SYNC_RETRY_INTERVAL = 60  # seconds


def should_attempt_sync():
    """Check if enough time has passed to attempt sync"""
    global last_sync_attempt
    current_time = time.time()
    
    if current_time - last_sync_attempt > SYNC_RETRY_INTERVAL:
        last_sync_attempt = current_time
        return True
    return False


def sync_offline_data(firebase_post_fn, wifi_check_fn):
    """Sync offline data in batches when connection restored"""
    if not wifi_check_fn():
        return 0
    
    try:
        data = load_offline_data()
        
        if len(data) == 0:
            return 0
        
        print(f"🔄 Syncing {len(data)} offline records...")
        synced = 0
        
        # Send in batches to avoid overwhelming the connection
        for i in range(0, len(data), SYNC_BATCH_SIZE):
            batch = data[i:i+SYNC_BATCH_SIZE]
            
            for record in batch:
                if firebase_post_fn(record):
                    synced += 1
                else:
                    # If one fails, stop syncing
                    break
            
            if synced < i + len(batch):
                # Connection issue detected
                break
        
        # Remove successfully synced records
        if synced > 0:
            clear_synced_records(synced)
            print(f"✓ Synced {synced} records successfully")
        
        return synced
    except Exception as e:
        print("Sync error:", e)
        return 0
