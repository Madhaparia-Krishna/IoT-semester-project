# ESP32 Integration Guide 🔌

Complete guide for integrating ESP32 IoT sensors with VermIQ-Lite dashboard.

---

## Table of Contents

1. [Hardware Requirements](#hardware-requirements)
2. [Sensor Wiring](#sensor-wiring)
3. [Arduino Code](#arduino-code)
4. [MQTT Configuration](#mqtt-configuration)
5. [Firebase Integration](#firebase-integration)
6. [Troubleshooting](#troubleshooting)

---

## Hardware Requirements

### Components List

| Component | Quantity | Purpose |
|-----------|----------|---------|
| ESP32-WROOM-32 | 1 | Main microcontroller |
| Capacitive Soil Moisture Sensor | 1 | Measure soil moisture |
| DHT22 Temperature/Humidity Sensor | 1 | Measure temp & humidity |
| 3.7V Li-ion Battery (2000mAh+) | 1 | Power supply |
| TP4056 Charging Module | 1 | Battery charging |
| Solar Panel (5V, 1W) | 1 | Solar charging (optional) |
| Jumper Wires | 10+ | Connections |
| Breadboard or PCB | 1 | Prototyping |
| Waterproof Enclosure | 1 | Outdoor protection |

### Tools Needed

- Soldering iron and solder
- Multimeter
- USB-C cable for programming
- Wire strippers
- Heat shrink tubing

---

## Sensor Wiring

### Pin Configuration

```
ESP32 Pin Layout:
┌─────────────────────────────┐
│  ESP32-WROOM-32             │
│                             │
│  3V3  ──────────────  VCC   │ → Sensors VCC
│  GND  ──────────────  GND   │ → Sensors GND
│  GPIO 15 ────────────  DHT  │ → DHT22 Data
│  GPIO 34 ────────────  MOIST│ → Moisture Analog
│  GPIO 2  ────────────  LED  │ → Status LED
│                             │
└─────────────────────────────┘
```

### DHT22 Wiring

```
DHT22 Sensor:
┌──────────┐
│   DHT22  │
│          │
│  VCC ────┼──── 3.3V (ESP32)
│  DATA ───┼──── GPIO 15 (ESP32) + 10kΩ pull-up to 3.3V
│  NC   ───┼──── (Not Connected)
│  GND ────┼──── GND (ESP32)
└──────────┘
```

### Capacitive Soil Moisture Sensor

```
Moisture Sensor:
┌──────────────┐
│   Capacitive │
│   Moisture   │
│              │
│  VCC ────────┼──── 3.3V (ESP32)
│  GND ────────┼──── GND (ESP32)
│  AOUT ───────┼──── GPIO 34 (ESP32 ADC)
└──────────────┘
```

### Power Circuit

```
Power System:
┌─────────┐     ┌──────────┐     ┌────────┐
│ Solar   │────▶│ TP4056   │────▶│ ESP32  │
│ Panel   │     │ Charger  │     │        │
│ 5V 1W   │     └────┬─────┘     └────────┘
└─────────┘          │
                     │
              ┌──────▼──────┐
              │  Li-ion     │
              │  3.7V       │
              │  2000mAh    │
              └─────────────┘
```

---

## Arduino Code

### 1. Install Required Libraries

Open Arduino IDE and install:

```
Tools → Manage Libraries → Search and Install:
- DHT sensor library by Adafruit
- Adafruit Unified Sensor
- PubSubClient (MQTT)
- ArduinoJson
- WiFi (built-in)
```

### 2. ESP32 Board Setup

```
File → Preferences → Additional Board Manager URLs:
https://dl.espressif.com/dl/package_esp32_index.json

Tools → Board → Boards Manager → Search "ESP32" → Install
Tools → Board → ESP32 Arduino → ESP32 Dev Module
```

### 3. Complete Arduino Sketch

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker (CloudMQTT, HiveMQ, or local broker)
const char* mqtt_server = "broker.hivemq.com";  // Public broker for testing
const int mqtt_port = 1883;
const char* mqtt_user = "";  // Leave empty for public broker
const char* mqtt_password = "";

// Device Configuration
const char* device_id = "ESP32-NODE-01";
const char* bed_name = "Vermicompost Bed #1";

// Pin Definitions
#define DHTPIN 15          // DHT22 data pin
#define MOISTURE_PIN 34    // Analog pin for moisture sensor
#define LED_PIN 2          // Built-in LED for status

// Sensor Configuration
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Timing Configuration
const long telemetryInterval = 30000;  // Send data every 30 seconds
const long deepSleepTime = 300;        // Deep sleep for 5 minutes (battery saving)

// ============================================
// GLOBAL VARIABLES
// ============================================

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastTelemetry = 0;
int daysElapsed = 0;  // Track compost maturity days

// Moisture calibration values (adjust based on your sensor)
const int moistureAirValue = 3200;    // Sensor value in air (dry)
const int moistureWaterValue = 1200;  // Sensor value in water (wet)

// ============================================
// SETUP
// ============================================

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  Serial.println("\n\n=================================");
  Serial.println("VermIQ-Lite ESP32 Sensor Node");
  Serial.println("=================================\n");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Connect to WiFi
  connectWiFi();
  
  // Connect to MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);
  connectMQTT();
  
  // Load days elapsed from RTC memory (persists through deep sleep)
  loadDaysElapsed();
  
  Serial.println("Setup complete. Starting telemetry loop...\n");
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Maintain MQTT connection
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();
  
  // Send telemetry at interval
  unsigned long currentMillis = millis();
  if (currentMillis - lastTelemetry >= telemetryInterval) {
    lastTelemetry = currentMillis;
    sendTelemetry();
  }
  
  // Optional: Enter deep sleep to save battery
  // Uncomment for battery-powered operation
  // enterDeepSleep();
}

// ============================================
// WIFI CONNECTION
// ============================================

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));  // Blink LED
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    digitalWrite(LED_PIN, HIGH);  // LED on when connected
  } else {
    Serial.println("\nWiFi connection failed!");
    digitalWrite(LED_PIN, LOW);
  }
}

// ============================================
// MQTT CONNECTION
// ============================================

void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT broker...");
    
    String clientId = "VermIQ-";
    clientId += device_id;
    
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("connected!");
      
      // Subscribe to command topic
      String commandTopic = "vermiq/" + String(device_id) + "/command";
      client.subscribe(commandTopic.c_str());
      
      // Publish online status
      String statusTopic = "vermiq/" + String(device_id) + "/status";
      client.publish(statusTopic.c_str(), "online", true);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds...");
      delay(5000);
    }
  }
}

// ============================================
// MQTT CALLBACK (Receive Commands)
// ============================================

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("Payload: ");
  Serial.println(message);
  
  // Parse JSON command
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if (!error) {
    const char* command = doc["command"];
    
    if (strcmp(command, "reset_days") == 0) {
      daysElapsed = 0;
      Serial.println("Days elapsed reset to 0");
    } else if (strcmp(command, "calibrate") == 0) {
      Serial.println("Calibration mode activated");
      // Add calibration logic here
    }
  }
}

// ============================================
// READ SENSORS
// ============================================

float readMoisture() {
  int rawValue = analogRead(MOISTURE_PIN);
  
  // Convert to percentage (0-100%)
  float moisture = map(rawValue, moistureAirValue, moistureWaterValue, 0, 100);
  moisture = constrain(moisture, 0, 100);
  
  Serial.print("Moisture Raw: ");
  Serial.print(rawValue);
  Serial.print(" → ");
  Serial.print(moisture);
  Serial.println("%");
  
  return moisture;
}

float readTemperature() {
  float temp = dht.readTemperature();
  
  if (isnan(temp)) {
    Serial.println("Failed to read temperature from DHT sensor!");
    return 0.0;
  }
  
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.println("°C");
  
  return temp;
}

float readHumidity() {
  float humidity = dht.readHumidity();
  
  if (isnan(humidity)) {
    Serial.println("Failed to read humidity from DHT sensor!");
    return 0.0;
  }
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  
  return humidity;
}

float readBatteryVoltage() {
  // Read battery voltage from ADC (if connected to voltage divider)
  // Adjust based on your circuit
  int rawValue = analogRead(35);  // GPIO 35 for battery monitoring
  float voltage = (rawValue / 4095.0) * 3.3 * 2;  // Assuming 1:2 voltage divider
  
  Serial.print("Battery Voltage: ");
  Serial.print(voltage);
  Serial.println("V");
  
  return voltage;
}

// ============================================
// SEND TELEMETRY
// ============================================

void sendTelemetry() {
  Serial.println("\n--- Reading Sensors ---");
  
  // Read all sensors
  float moisture = readMoisture();
  float temperature = readTemperature();
  float humidity = readHumidity();
  float battery = readBatteryVoltage();
  int rssi = WiFi.RSSI();
  
  // Increment days (simplified - use RTC for accurate tracking)
  daysElapsed++;
  
  // Determine harvest status
  String harvestStatus = "Monitoring";
  if (daysElapsed >= 57) {
    harvestStatus = "Harvest Ready";
  } else if (daysElapsed >= 48) {
    harvestStatus = "Ready Soon";
  }
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  doc["device_id"] = device_id;
  doc["bed_name"] = bed_name;
  doc["timestamp"] = millis();
  doc["moisture"] = moisture;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["days_elapsed"] = daysElapsed;
  doc["harvest_status"] = harvestStatus;
  doc["battery"] = battery;
  doc["rssi"] = rssi;
  doc["status"] = "online";
  
  // Serialize to string
  String payload;
  serializeJson(doc, payload);
  
  // Publish to MQTT
  String telemetryTopic = "vermiq/" + String(device_id) + "/telemetry";
  
  if (client.publish(telemetryTopic.c_str(), payload.c_str())) {
    Serial.println("\n✓ Telemetry sent successfully!");
    Serial.println("Topic: " + telemetryTopic);
    Serial.println("Payload: " + payload);
    
    // Blink LED to indicate successful transmission
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_PIN, LOW);
      delay(100);
      digitalWrite(LED_PIN, HIGH);
      delay(100);
    }
  } else {
    Serial.println("\n✗ Failed to send telemetry!");
  }
  
  Serial.println("--- Telemetry Complete ---\n");
}

// ============================================
// DEEP SLEEP (Battery Saving)
// ============================================

void enterDeepSleep() {
  Serial.println("Entering deep sleep mode...");
  
  // Save days elapsed to RTC memory
  saveDaysElapsed();
  
  // Configure wake-up timer
  esp_sleep_enable_timer_wakeup(deepSleepTime * 1000000);  // Convert to microseconds
  
  // Enter deep sleep
  esp_deep_sleep_start();
}

void loadDaysElapsed() {
  // Load from EEPROM or RTC memory
  // Simplified version - implement persistent storage
  daysElapsed = 0;
}

void saveDaysElapsed() {
  // Save to EEPROM or RTC memory
  // Implement persistent storage
}
```

---

## MQTT Configuration

### Topic Structure

```
vermiq/{device_id}/telemetry    → Sensor data (publish)
vermiq/{device_id}/status       → Online/offline (publish)
vermiq/{device_id}/command      → Remote commands (subscribe)
```

### Telemetry Payload Format

```json
{
  "device_id": "ESP32-NODE-01",
  "bed_name": "Vermicompost Bed #1",
  "timestamp": 1234567890,
  "moisture": 72.4,
  "temperature": 21.8,
  "humidity": 81.2,
  "days_elapsed": 48,
  "harvest_status": "Ready Soon",
  "battery": 3.85,
  "rssi": -62,
  "status": "online"
}
```

### MQTT Brokers

**Public Brokers (Testing)**:
- `broker.hivemq.com:1883`
- `test.mosquitto.org:1883`

**Production Brokers**:
- [CloudMQTT](https://www.cloudmqtt.com/) - Managed MQTT
- [AWS IoT Core](https://aws.amazon.com/iot-core/) - Enterprise
- [Google Cloud IoT](https://cloud.google.com/iot-core) - Scalable
- Self-hosted Mosquitto

---

## Firebase Integration

### Option 1: MQTT Bridge to Firebase

Use Cloud Functions to bridge MQTT to Firestore:

```javascript
// Firebase Cloud Function
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mqtt = require('mqtt');

admin.initializeApp();

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  client.subscribe('vermiq/+/telemetry');
});

client.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  
  await admin.firestore()
    .collection('telemetry')
    .doc(data.device_id)
    .set(data, { merge: true });
});
```

### Option 2: Direct HTTP to Firebase

Modify ESP32 code to POST directly to Firebase:

```cpp
#include <HTTPClient.h>

void sendToFirebase(String payload) {
  HTTPClient http;
  
  String url = "https://YOUR_PROJECT.firebaseio.com/telemetry/" + String(device_id) + ".json?auth=YOUR_SECRET";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.PUT(payload);
  
  if (httpCode > 0) {
    Serial.println("Firebase update successful");
  }
  
  http.end();
}
```

---

## Troubleshooting

### Sensor Issues

**Moisture sensor always reads 0 or 100**:
- Calibrate sensor in air and water
- Adjust `moistureAirValue` and `moistureWaterValue`
- Check wiring and power supply

**DHT22 returns NaN**:
- Check 10kΩ pull-up resistor on data line
- Verify 3.3V power supply
- Add delay between readings (2 seconds minimum)

### WiFi Connection Problems

**ESP32 won't connect**:
- Verify SSID and password
- Check 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move closer to router
- Check router firewall settings

### MQTT Issues

**Can't connect to broker**:
- Test broker with MQTT.fx or MQTT Explorer
- Verify broker address and port
- Check firewall rules
- Use public broker for testing

### Power Management

**Battery drains quickly**:
- Enable deep sleep mode
- Reduce telemetry frequency
- Use larger battery (3000mAh+)
- Add solar panel for continuous charging

---

## Next Steps

1. **Test on breadboard** with all sensors
2. **Calibrate sensors** in actual compost environment
3. **Design PCB** for permanent installation
4. **3D print enclosure** for weatherproofing
5. **Deploy to production** vermiculture beds

---

**Hardware integration complete! Your ESP32 is now ready to send real-time telemetry to VermIQ-Lite dashboard.**
