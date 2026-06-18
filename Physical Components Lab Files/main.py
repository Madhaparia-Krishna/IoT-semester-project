from machine import Pin, ADC, I2C
import time
import network
import ujson
import framebuf
import dht
import gc

try:
    import urequests
except:
    urequests = None

try:
    from umqtt.simple import MQTTClient
except:
    MQTTClient = None

# Import modular components
from config import *
from offline_storage import add_offline_record, get_offline_count
from data_validator import add_metadata
from sync_manager import sync_offline_data, should_attempt_sync
from watchdog_manager import setup_watchdog, feed_watchdog


# =================================================
# SH1106 OLED DRIVER
# =================================================
class SH1106_I2C(framebuf.FrameBuffer):
    def __init__(self, width, height, i2c, addr=0x3C):
        self.width = width
        self.height = height
        self.i2c = i2c
        self.addr = addr
        self.pages = self.height // 8
        self.buffer = bytearray(self.width * self.pages)

        super().__init__(
            self.buffer,
            self.width,
            self.height,
            framebuf.MONO_VLSB
        )

        self.init_display()

    def write_cmd(self, cmd):
        self.i2c.writeto(self.addr, bytearray([0x00, cmd]))

    def write_data(self, data):
        self.i2c.writeto(self.addr, bytearray([0x40]) + data)

    def init_display(self):
        cmds = [
            0xAE, 0xD5, 0x80, 0xA8, 0x3F,
            0xD3, 0x00, 0x40, 0xAD, 0x8B,
            0xA1, 0xC8, 0xDA, 0x12, 0x81,
            0xCF, 0xD9, 0xF1, 0xDB, 0x40,
            0xA4, 0xA6, 0xAF
        ]

        for cmd in cmds:
            self.write_cmd(cmd)

        self.fill(0)
        self.show()

    def show(self):
        column_offset = 2

        for page in range(self.pages):
            self.write_cmd(0xB0 + page)
            self.write_cmd(0x00 + (column_offset & 0x0F))
            self.write_cmd(0x10 + ((column_offset >> 4) & 0x0F))

            start = self.width * page
            end = start + self.width
            self.write_data(self.buffer[start:end])


# =================================================
# OLED SETUP
# =================================================
i2c = I2C(0, scl=Pin(OLED_SCL), sda=Pin(OLED_SDA), freq=100000)
print("I2C scan:", i2c.scan())

oled = SH1106_I2C(128, 64, i2c, addr=0x3C)


def oled_message(line1="", line2="", line3="", line4="", line5="", line6=""):
    oled.fill(0)
    oled.text(str(line1), 0, 0)
    oled.text(str(line2), 0, 10)
    oled.text(str(line3), 0, 20)
    oled.text(str(line4), 0, 30)
    oled.text(str(line5), 0, 40)
    oled.text(str(line6), 0, 50)
    oled.show()


oled_message("Enhanced v2.0", "Security ON", "Offline ON", "Starting...")


# =================================================
# SENSOR SETUP
# =================================================
dht22_sensor = dht.DHT22(Pin(DHT22_PIN, Pin.IN, Pin.PULL_UP))

moisture_adc = ADC(Pin(MOISTURE_PIN))
moisture_adc.atten(ADC.ATTN_11DB)

ph_adc = ADC(Pin(PH_PIN))
ph_adc.atten(ADC.ATTN_11DB)

try:
    moisture_adc.width(ADC.WIDTH_12BIT)
    ph_adc.width(ADC.WIDTH_12BIT)
except:
    pass


# =================================================
# WIFI FUNCTIONS
# =================================================
wlan = network.WLAN(network.STA_IF)
wifi_retry_count = 0


def connect_wifi():
    global wifi_retry_count
    
    wlan.active(True)

    if wlan.isconnected():
        wifi_retry_count = 0
        return True

    print("Connecting to WiFi...")
    oled_message("Connecting", "to WiFi...")

    wlan.connect(WIFI_SSID, WIFI_PASSWORD)

    timeout = 30

    while not wlan.isconnected() and timeout > 0:
        print(".", end="")
        time.sleep(1)
        timeout -= 1
        feed_watchdog()

    print()

    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print("✓ WiFi connected:", ip)
        oled_message("WiFi Connected", ip)
        time.sleep(1)
        wifi_retry_count = 0
        
        # Sync offline data
        synced = sync_offline_data(firebase_post_history, wifi_is_connected)
        if synced > 0:
            oled_message("Synced", f"{synced} records")
            time.sleep(2)
        
        return True
    else:
        wifi_retry_count += 1
        print(f"WiFi failed (attempt {wifi_retry_count})")
        oled_message("WiFi Failed", "Going offline...")
        time.sleep(1)
        return False


def wifi_is_connected():
    try:
        return wlan.isconnected()
    except:
        return False


# =================================================
# MQTT FUNCTIONS
# =================================================
def connect_mqtt():
    if MQTTClient is None:
        print("MQTT library not available")
        return None

    try:
        client = MQTTClient(
            client_id=MQTT_CLIENT_ID,
            server=MQTT_BROKER,
            port=MQTT_PORT,
            keepalive=60
        )

        client.connect()
        print("✓ MQTT connected")
        oled_message("MQTT Connected", "Ready")
        time.sleep(1)

        return client

    except Exception as e:
        print("MQTT connection failed:", e)
        return None


def mqtt_publish(client, payload):
    if not USE_MQTT or client is None:
        return client

    try:
        client.publish(MQTT_TOPIC, ujson.dumps(payload))
        print("MQTT published")
        return client

    except Exception as e:
        print("MQTT publish failed:", e)

        try:
            client = connect_mqtt()
        except:
            client = None

        return client


# =================================================
# FIREBASE FUNCTIONS
# =================================================
def firebase_build_url(path):
    url = FIREBASE_URL + path

    if FIREBASE_AUTH != "":
        url = url + "?auth=" + FIREBASE_AUTH

    return url


def firebase_put_latest(payload):
    if not USE_FIREBASE:
        return False

    if urequests is None:
        print("urequests library not available")
        return False

    if not wifi_is_connected():
        return False

    try:
        url = firebase_build_url(FIREBASE_LATEST_PATH)

        response = urequests.put(
            url,
            data=ujson.dumps(payload),
            headers={"Content-Type": "application/json"}
        )

        success = response.status_code in [200, 201]
        print(f"Firebase latest: {response.status_code}")
        response.close()

        return success

    except Exception as e:
        print("Firebase latest failed:", e)
        return False


def firebase_post_history(payload):
    if not USE_FIREBASE:
        return False

    if urequests is None:
        return False

    if not wifi_is_connected():
        return False

    try:
        url = firebase_build_url(FIREBASE_HISTORY_PATH)

        response = urequests.post(
            url,
            data=ujson.dumps(payload),
            headers={"Content-Type": "application/json"}
        )

        success = response.status_code in [200, 201]
        print(f"Firebase history: {response.status_code}")
        response.close()

        return success

    except Exception as e:
        print("Firebase history failed:", e)
        return False


# =================================================
# SENSOR READ FUNCTIONS
# =================================================
def read_dht22():
    try:
        dht22_sensor.measure()

        temp = dht22_sensor.temperature()
        hum = dht22_sensor.humidity()

        temp = temp + DHT_TEMP_OFFSET
        hum = hum + DHT_HUM_OFFSET

        return temp, hum

    except Exception as e:
        print("DHT22 read error:", e)
        return None, None


def read_adc_average(adc, samples=10):
    total = 0

    for i in range(samples):
        total += adc.read()
        time.sleep_ms(30)

    return total // samples


def clamp(value, low, high):
    if value < low:
        return low

    if value > high:
        return high

    return value


def read_moisture():
    try:
        raw = read_adc_average(moisture_adc)

        moisture_percent = (
            (MOISTURE_DRY_RAW - raw) /
            (MOISTURE_DRY_RAW - MOISTURE_WET_RAW)
        ) * 100

        moisture_percent = clamp(moisture_percent, 0, 100)

        return raw, moisture_percent
    except Exception as e:
        print("Moisture error:", e)
        return None, None


def read_ph():
    try:
        raw = read_adc_average(ph_adc)

        voltage = (raw / 4095) * 3.3

        ph = 7 + ((PH_NEUTRAL_VOLTAGE - voltage) / PH_SLOPE)

        return raw, voltage, ph
    except Exception as e:
        print("pH error:", e)
        return None, None, None


def show_value(value, decimals=1):
    if value is None:
        return "N/A"

    return str(round(value, decimals))


# =================================================
# STARTUP
# =================================================
print("="*50)
print("ENHANCED IoT SYSTEM v2.0")
print("Security + Offline Support + Auto-Recovery")
print("="*50)

# Setup watchdog for crash recovery
setup_watchdog(timeout_ms=30000)

client = None

if USE_FIREBASE or USE_MQTT:
    connect_wifi()

if USE_MQTT and wifi_is_connected():
    client = connect_mqtt()

print("Starting sensor monitoring...")
print(f"Firebase: {USE_FIREBASE}")
print(f"MQTT: {USE_MQTT}")
print("="*50)

oled_message("System Ready", "Monitoring...")
time.sleep(2)

last_firebase_upload = 0
iteration_count = 0


# =================================================
# MAIN LOOP
# =================================================
while True:
    try:
        feed_watchdog()
        iteration_count += 1
        
        dht22_temp, dht22_hum = read_dht22()
        moisture_raw, moisture_percent = read_moisture()
        ph_raw, ph_voltage, ph = read_ph()

        timestamp = time.time()

        payload = {
            "timestamp": timestamp,
            "dht22_temp": dht22_temp,
            "dht22_humidity": dht22_hum,
            "moisture_raw": moisture_raw,
            "moisture_percent": round(moisture_percent, 2) if moisture_percent else None,
            "ph_raw": ph_raw,
            "ph_voltage": round(ph_voltage, 3) if ph_voltage else None,
            "ph": round(ph, 2) if ph else None,
            "iteration": iteration_count
        }
        
        # Add security metadata and validation
        payload = add_metadata(payload)

        print(f"\n--- Reading #{iteration_count} ---")
        print(f"Temp: {dht22_temp}°C | Hum: {dht22_hum}%")
        print(f"Moisture: {round(moisture_percent, 2) if moisture_percent else 'N/A'}%")
        print(f"pH: {round(ph, 2) if ph else 'N/A'}")
        print(f"Valid: {payload['valid']}")

        # Display on OLED
        buffer_count = get_offline_count()
        wifi_status = "OK" if wifi_is_connected() else "OFF"
        
        oled.fill(0)
        oled.text("Enhanced v2.0", 0, 0)
        oled.text(f"T:{show_value(dht22_temp)}C H:{show_value(dht22_hum,0)}%", 0, 10)
        oled.text(f"M:{show_value(moisture_percent,0)}%", 0, 20)
        oled.text(f"pH:{show_value(ph)}", 0, 30)
        oled.text(f"WiFi:{wifi_status} Buf:{buffer_count}", 0, 40)
        oled.text(f"#{iteration_count}", 0, 50)
        oled.show()

        # Handle connectivity
        if USE_FIREBASE or USE_MQTT:
            if not wifi_is_connected() and should_attempt_sync():
                print("Attempting WiFi reconnect...")
                connect_wifi()

        # Upload data if online
        current_time = time.time()
        uploaded = False
        
        if wifi_is_connected():
            if USE_MQTT:
                client = mqtt_publish(client, payload)
            
            if USE_FIREBASE and current_time - last_firebase_upload >= FIREBASE_UPLOAD_INTERVAL:
                if firebase_put_latest(payload) and firebase_post_history(payload):
                    uploaded = True
                    print("✓ Uploaded to Firebase")
                
                last_firebase_upload = current_time
        
        # Store offline if not uploaded
        if not uploaded:
            add_offline_record(payload)
        
        # Memory management
        if iteration_count % 10 == 0:
            gc.collect()
            print(f"Memory: {gc.mem_free()} bytes free")
        
        print("="*40)

    except Exception as e:
        print("Main loop error:", e)
        oled_message("System Error", str(e)[:16], "Recovering...")
        time.sleep(2)

    time.sleep(3)
