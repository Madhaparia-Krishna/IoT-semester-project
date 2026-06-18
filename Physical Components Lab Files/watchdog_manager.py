# Watchdog manager - Automatic system recovery from crashes
from machine import WDT

wdt = None
watchdog_enabled = False


def setup_watchdog(timeout_ms=30000):
    """Setup watchdog timer for crash recovery"""
    global wdt, watchdog_enabled
    
    try:
        wdt = WDT(timeout=timeout_ms)
        watchdog_enabled = True
        print(f"✓ Watchdog enabled ({timeout_ms/1000}s timeout)")
        return True
    except Exception as e:
        print("⚠ Watchdog not available:", e)
        watchdog_enabled = False
        return False


def feed_watchdog():
    """Feed the watchdog timer to prevent system reset"""
    if watchdog_enabled and wdt is not None:
        try:
            wdt.feed()
        except:
            pass


def is_enabled():
    """Check if watchdog is enabled"""
    return watchdog_enabled
