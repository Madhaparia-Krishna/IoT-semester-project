# Configuration file - Separated from main code for security
from ubinascii import hexlify
from machine import unique_id

# WiFi Configuration
WIFI_SSID = "K8597"
WIFI_PASSWORD = "00001111"

# Firebase Configuration
FIREBASE_URL = "https://iot-vermiq-default-rtdb.firebaseio.com/"
FIREBASE_AUTH = ""
FIREBASE_LATEST_PATH = "/iot_lab/latest.json"
FIREBASE_HISTORY_PATH = "/iot_lab/history.json"
FIREBASE_UPLOAD_INTERVAL = 10

# MQTT Configuration
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "iot/lab/sensor"
MQTT_CLIENT_ID = b"esp32-soil-ph-dht22-" + hexlify(unique_id())

# Feature Flags
USE_FIREBASE = True
USE_MQTT = False

# Hardware Pin Configuration
OLED_SDA = 21
OLED_SCL = 22
DHT22_PIN = 4
MOISTURE_PIN = 34
PH_PIN = 35

# Sensor Calibration
DHT_TEMP_OFFSET = 0.0
DHT_HUM_OFFSET = 0.0
MOISTURE_DRY_RAW = 3300
MOISTURE_WET_RAW = 1300
PH_NEUTRAL_VOLTAGE = 2.5
PH_SLOPE = 0.18
