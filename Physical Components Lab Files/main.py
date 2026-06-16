from machine import Pin, ADC, I2C, unique_id
import time
import network
import ujson
import framebuf
import dht
from ubinascii import hexlify

try:
    import urequests
except:
    urequests = None

try:
    from umqtt.simple import MQTTClient
except:
    MQTTClient = None


# =================================================
# MAIN SETTINGS
# =================================================
USE_FIREBASE = True
USE_MQTT = False

WIFI_SSID = "K8597"
WIFI_PASSWORD = "00001111"


# =================================================
# FIREBASE SETTINGS
# =================================================
# Example:
# FIREBASE_URL = "https://your-project-id-default-rtdb.firebaseio.com"
FIREBASE_URL = "https://iot-vermiq-default-rtdb.firebaseio.com/"

# Leave empty if your Firebase Realtime Database is in test mode
FIREBASE_AUTH = ""

FIREBASE_LATEST_PATH = "/iot_lab/latest.json"
FIREBASE_HISTORY_PATH = "/iot_lab/history.json"

FIREBASE_UPLOAD_INTERVAL = 10   # seconds


# =================================================
# MQTT SETTINGS
# =================================================
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "iot/lab/sensor"
MQTT_CLIENT_ID = b"esp32-soil-ph-dht22-" + hexlify(unique_id())


# =================================================
# PIN SETTINGS
# =================================================
OLED_SDA = 21
OLED_SCL = 22

DHT22_PIN = 4

MOISTURE_PIN = 34
PH_PIN = 35


# =================================================
# CALIBRATION
# =================================================
DHT_TEMP_OFFSET = 0.0
DHT_HUM_OFFSET = 0.0

# Adjust these after testing your soil sensor
# Put sensor in dry air/soil and note raw value
# Put sensor in wet soil/water and note raw value
MOISTURE_DRY_RAW = 3300
MOISTURE_WET_RAW = 1300

# Basic pH approximation
# Better calibration should be done using pH 4, pH 7 and pH 10 buffer solutions
PH_NEUTRAL_VOLTAGE = 2.5
PH_SLOPE = 0.18


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


oled_message("IoT System", "OLED Ready", "Starting...")


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


def connect_wifi():
    wlan.active(True)

    if wlan.isconnected():
        return True

    print("Connecting to WiFi...")
    oled_message("Connecting", "to WiFi...")

    wlan.connect(WIFI_SSID, WIFI_PASSWORD)

    timeout = 30

    while not wlan.isconnected() and timeout > 0:
        print(".", end="")
        time.sleep(1)
        timeout -= 1

    print()

    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print("WiFi connected")
        print("IP:", ip)
        oled_message("WiFi Connected", ip)
        time.sleep(1)
        return True
    else:
        print("WiFi failed")
        oled_message("WiFi Failed", "Check hotspot")
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
        print("MQTT connected")
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
        print("WiFi not connected, Firebase skipped")
        return False

    try:
        url = firebase_build_url(FIREBASE_LATEST_PATH)

        response = urequests.put(
            url,
            data=ujson.dumps(payload),
            headers={"Content-Type": "application/json"}
        )

        print("Firebase latest status:", response.status_code)
        response.close()

        return True

    except Exception as e:
        print("Firebase latest upload failed:", e)
        return False


def firebase_post_history(payload):
    if not USE_FIREBASE:
        return False

    if urequests is None:
        print("urequests library not available")
        return False

    if not wifi_is_connected():
        print("WiFi not connected, Firebase skipped")
        return False

    try:
        url = firebase_build_url(FIREBASE_HISTORY_PATH)

        response = urequests.post(
            url,
            data=ujson.dumps(payload),
            headers={"Content-Type": "application/json"}
        )

        print("Firebase history status:", response.status_code)
        response.close()

        return True

    except Exception as e:
        print("Firebase history upload failed:", e)
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
    raw = read_adc_average(moisture_adc)

    moisture_percent = (
        (MOISTURE_DRY_RAW - raw) /
        (MOISTURE_DRY_RAW - MOISTURE_WET_RAW)
    ) * 100

    moisture_percent = clamp(moisture_percent, 0, 100)

    return raw, moisture_percent


def read_ph():
    raw = read_adc_average(ph_adc)

    voltage = (raw / 4095) * 3.3

    ph = 7 + ((PH_NEUTRAL_VOLTAGE - voltage) / PH_SLOPE)

    return raw, voltage, ph


def show_value(value, decimals=1):
    if value is None:
        return "N/A"

    return str(round(value, decimals))


# =================================================
# STARTUP
# =================================================
client = None

if USE_FIREBASE or USE_MQTT:
    connect_wifi()

if USE_MQTT and wifi_is_connected():
    client = connect_mqtt()

print("Starting final IoT system...")
print("OLED enabled")
print("DHT22 on GPIO4")
print("Moisture on GPIO34")
print("pH on GPIO35")
print("Firebase:", USE_FIREBASE)
print("MQTT:", USE_MQTT)
print("--------------------------------------")

oled_message("System Ready", "DHT22 GPIO4", "Moisture GPIO34", "pH GPIO35")
time.sleep(2)

last_firebase_upload = 0


# =================================================
# MAIN LOOP
# =================================================
while True:
    try:
        dht22_temp, dht22_hum = read_dht22()

        moisture_raw, moisture_percent = read_moisture()
        ph_raw, ph_voltage, ph = read_ph()

        timestamp = time.time()

        payload = {
            "timestamp": timestamp,
            "dht22_temp": dht22_temp,
            "dht22_humidity": dht22_hum,
            "moisture_raw": moisture_raw,
            "moisture_percent": round(moisture_percent, 2),
            "ph_raw": ph_raw,
            "ph_voltage": round(ph_voltage, 3),
            "ph": round(ph, 2)
        }

        print("DHT22 Temp:", dht22_temp)
        print("DHT22 Hum:", dht22_hum)
        print("Moisture Raw:", moisture_raw)
        print("Moisture %:", round(moisture_percent, 2))
        print("pH Raw:", ph_raw)
        print("pH Voltage:", round(ph_voltage, 3), "V")
        print("pH:", round(ph, 2))
        print("--------------------------------------")

        oled.fill(0)
        oled.text("IoT Sensor Data", 0, 0)
        oled.text("Air:" + show_value(dht22_temp) + "C", 0, 10)
        oled.text("Hum:" + show_value(dht22_hum, 0) + "%", 0, 20)
        oled.text("Moist:" + str(round(moisture_percent, 1)) + "%", 0, 30)
        oled.text("pH:" + str(round(ph, 2)), 0, 40)
        oled.text("WiFi:" + ("OK" if wifi_is_connected() else "NO"), 0, 50)
        oled.show()

        if USE_FIREBASE or USE_MQTT:
            if not wifi_is_connected():
                connect_wifi()

        if USE_MQTT:
            client = mqtt_publish(client, payload)

        current_time = time.time()

        if USE_FIREBASE and current_time - last_firebase_upload >= FIREBASE_UPLOAD_INTERVAL:
            firebase_put_latest(payload)
            firebase_post_history(payload)
            last_firebase_upload = current_time

    except Exception as e:
        print("Main loop error:", e)
        oled_message("System Error", str(e)[:16], "Still running...")

    time.sleep(3)