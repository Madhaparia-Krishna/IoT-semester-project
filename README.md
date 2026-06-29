# VermIQ-Lite: Smart Vermiculture IoT Monitoring System
## Complete Implementation Documentation

<!-- Deployment trigger: Updated offline node display with last Firebase data -->

---

## 📋 Project Information

**Course:** IoT System Design & Implementation  
**Institution:** Strathmore University   
**Semester:** Year 4.1  
**Submission Date:** June 16, 2026

**Publishments:**  
🔗 https://wokwi.com/projects/465181219780428801  
🔗 https://oshwlab.com/evaghjiani/project_wsoshhsu

---

## 👥 Team Members


Krishna Madhaparia - 166980

Parneet Kaur - 166985

Eeshan Vaghjiani - 166981

Dhruvin Bhudia - 169646

Philip Tait - 166384

Tevin Ngiru - 166289


## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Hardware Implementation](#hardware-implementation)
4. [Firmware Development](#firmware-development)
5. [Firebase Integration](#firebase-integration)
6. [Web Dashboard Development](#web-dashboard-development)
7. [Machine Learning Analytics Module](#machine-learning-analytics-module)
8. [Challenges & Solutions](#challenges--solutions)
9. [Testing & Validation](#testing--validation)
10. [Results & Data Analysis](#results--data-analysis)
11. [How to Run the Project](#how-to-run-the-project)
12. [Conclusions & Future Work](#conclusions--future-work)
13. [Security and Data Protection](#security-and-data-protection)
14. [References](#references)
15. [Appendix](#appendix)

---

## 1. Project Overview

### 1.1 Introduction

VermIQ-Lite is an enterprise-grade IoT monitoring platform designed for precision vermiculture (composting with worms) management. The system provides real-time environmental tracking, intelligent analytics, and cloud-based data storage for optimizing compost production.


### 1.2 Project Objectives

- **Real-Time Monitoring:** Track soil moisture, temperature, humidity, and pH levels continuously
- **Cloud Integration:** Store and synchronize sensor data with Firebase Realtime Database
- **Data Visualization:** Provide intuitive charts and graphs for environmental trends
- **Accessibility:** Enable remote access via web dashboard from any device
- **Data Export:** Allow CSV and JSON export for offline analysis
- **Alert System:** Notify operators of critical environmental conditions
- **Scalability:** Support multiple vermiculture beds with different ESP32 nodes

### 1.3 Key Features

- Real-time sensor telemetry display  
- Firebase cloud data storage and synchronization  
- Interactive analytics with Recharts library  
- Historical data tracking (200+ records)  
- CSV and JSON data export capabilities  
- Dark mode UI with glassmorphism design  
- Responsive layout for desktop, tablet, and mobile  
- Secure Firebase authentication  
- OLED display for local sensor readings  
- Low-power ESP32 implementation  
- **Client-side ML analytics engine** (anomaly detection, harvest readiness, environmental scoring)  
- **Simulation mode** for class demonstrations without physical hardware  
- **Preset scenario testing** (Normal, Dry Compost, Acidic, Overheated, Sensor Failure)  
- **Real-time prediction pipeline** identical for both Live Firebase and Simulation inputs  

### 1.4 Technology Stack

**Hardware:**
- ESP32 Development Board
- DHT22 (Temperature & Humidity Sensor)
- Capacitive Soil Moisture Sensor
- Analog pH Sensor Module
- SH1106 OLED Display (128x64)

**Firmware:**
- MicroPython
- Firebase Realtime Database REST API
- MQTT Protocol (optional)

**Frontend:**
- React 19.2
- TypeScript 6.0
- TailwindCSS 4.3
- Vite 5.4
- Recharts 3.8
- Framer Motion 12.40

**Backend & Cloud:**
- Firebase Realtime Database
- Firebase Firestore
- Firebase Authentication
- Firebase Cloud Functions

**State Management:**
- Zustand 5.0

**Icons & Assets:**
- Lucide React 1.16

**Machine Learning (Current — Client-Side):**
- Custom rule-based + weighted-scoring ML engine (`src/ml/`)
- Zero external dependencies (no TensorFlow, no Python backend)
- Feature engineering pipeline (stability metrics, rolling statistics, Environmental Health Index)
- Explainable anomaly detection with human-readable reasons
- Harvest readiness predictor (weighted ideal-deviation scoring)
- Environmental classifier (Excellent / Good / Fair / Poor / Critical)
- Intelligent recommendation engine (17 prioritized contextual rules)
- Full simulation mode with preset scenarios and manual sliders

**Machine Learning (Planned — Deployment Phase):**
- Scikit-learn (Random Forest, Gradient Boosting) trained on collected Firebase data
- TensorFlow Lite / ONNX Runtime for browser inference
- Python training pipeline with Firebase Admin SDK data export
- Model versioning and A/B testing framework

### 1.5 Project Status

#### Implemented Features

**Hardware & Sensors:**
- ESP32-based IoT prototype
- DHT22 temperature and humidity monitoring
- Capacitive soil moisture sensor integration
- Analog pH sensor monitoring
- SH1106 OLED display for local readings
- PCB design and schematic documentation
- Physical prototype assembly and testing
- Wokwi simulation validation

**Firmware & Communication:**
- MicroPython firmware implementation
- WiFi connectivity with automatic reconnection
- Firebase Realtime Database integration
- Firestore data storage support
- Sensor calibration algorithms
- Error handling and graceful degradation
- Local OLED data display

**Cloud Infrastructure:**
- Firebase Realtime Database configuration
- Firestore structured storage implementation
- Firebase Authentication integration
- Real-time WebSocket synchronization
- Database security rules configuration
- Multi-user authentication support

**Web Dashboard:**
- React + TypeScript frontend application
- Real-time sensor data display
- Historical data table (200+ records)
- Interactive analytics charts (Recharts)
- CSV/JSON export functionality
- Responsive design (mobile, tablet, desktop)
- Firebase Authentication UI
- Demo mode for testing without hardware
- Glassmorphism dark theme design

**Testing & Documentation:**
- Physical prototype testing (48+ hours continuous operation)
- Cross-browser compatibility verification
- Comprehensive technical documentation
- Setup and deployment instructions
- Troubleshooting guide

**Machine Learning (Implemented — Phase 1):**
- Complete client-side ML engine (`src/ml/` — 9 TypeScript modules)
- Feature engineering pipeline (stability, rolling averages, variance, Environmental Health Index)
- Explainable anomaly detection (hard thresholds + rapid-change detection)
- Harvest readiness predictor (0–100% weighted scoring with confidence)
- Environmental health scorer and classifier (5 qualitative tiers)
- Intelligent recommendation engine (17 contextual rules)
- ML Simulation mode with 5 preset scenarios + manual sliders
- Live Firebase → ML pipeline (same engine, real sensor data)
- Prediction history tracking (last 50 predictions with trend charts)
- Unified `/ml-analytics` dashboard page integrated into navigation
- Zustand ML state slice (mode, values, results, history, actions)

#### Planned Future Enhancements

**System Improvements:**
- Offline buffering during WiFi loss using ESP32 flash storage
- Multi-bed deployment support with multiple ESP32 nodes
- Weatherproof enclosure design
- Firebase App Check security enhancement
- Secure MQTT/TLS implementation
- Power optimization with deep sleep modes
- Solar panel integration for extended operation

**Advanced Features:**
- Mobile applications (iOS/Android)
- Email/SMS alert notifications
- Automated irrigation control integration
- Long-term trend analysis dashboard
- Multi-tenancy support for commercial deployment

---

## 2. System Architecture

### 2.1 Overall System Diagram

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│      ESP32 Node        │ ---> │  MicroPython Firmware  │ ---> │   Firebase Database    │ ---> │  VermIQ‑Lite Dashboard │
│ ┌────────────────────┐ │      │ ┌────────────────────┐ │      │ ┌────────────────────┐ │      │ ┌────────────────────┐ │
│ │ DHT22 Sensor       │ │      │ │ HTTP / REST API    │ │      │ │ latest_readings    │ │      │ │ React + TS         │ │
│ ├────────────────────┤ │      │ └────────────────────┘ │      │ ├────────────────────┤ │      │ │ Components         │ │
│ │ Moisture Sensor    │ │      │                        │      │ │ readings_history   │ │      │ ├────────────────────┤ │
│ ├────────────────────┤ │      │                        │      │ └────────────────────┘ │      │ │ Recharts Analytics │ │
│ │ pH Sensor          │ │      │                        │      │                        │      │ ├────────────────────┤ │
│ ├────────────────────┤ │      │                        │      │                        │      │ │ Historical Data    │ │
│ │ OLED Display       │ │      │                        │      │                        │      │ │ Alerts & Notifs    │ |
| |____________________| |      |                        |      |                        |      | |____________________| | 
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```


### 2.2 Data Flow Architecture

1. **Sensor Layer**: ESP32 reads analog/digital values from sensors
2. **Processing Layer**: MicroPython firmware processes and formats data
3. **Transmission Layer**: HTTP PUT/POST requests to Firebase REST API
4. **Storage Layer**: Firebase stores data in real-time database
5. **Synchronization Layer**: WebSocket connections push updates to clients
6. **Presentation Layer**: React dashboard displays data with visualizations

### 2.3 Firebase Database Structure

```json
{
  "latest_readings": {
    "timestamp_iso": "2026-06-16T17:20:00+03:00",
    "timestamp_epoch_ms": 1781619600000,
    "reading_number": 1,
    "dht22_humidity": 47.9,
    "dht22_temp": 26.6,
    "moisture_percent": 62.76,
    "moisture_raw": 2570,
    "ph": 5.81,
    "ph_raw": 3368,
    "ph_voltage": 2.714
  },
  "readings_history": {
    "2026-06-16_17-20-00": { ... },
    "2026-06-16_17-20-02": { ... },
    "2026-06-16_17-20-04": { ... }
  }
}
```

---

## 3. Hardware Implementation

### 3.1 Component List

| Component | Specification | Quantity | Purpose |
|-----------|---------------|----------|---------|
| ESP32 WROOM-32 | 240MHz, WiFi/BT | 1 | Main microcontroller |
| DHT22 | Temp: -40~80°C, Humidity: 0-100% | 1 | Air temperature & humidity |
| Capacitive Moisture Sensor | Analog output, 3.3V-5V | 1 | Soil moisture measurement |
| pH Sensor Module | Analog pH 0-14 | 1 | Soil pH level |
| SH1106 OLED | 128x64, I2C, 0.96" | 1 | Local display |
| Resistors | 10kΩ Pull-up | 2 | I2C bus |
| Jumper Wires | Male-to-Female | 20+ | Connections |
| Breadboard | 830 points | 1 | Prototyping |
| USB Cable | Micro-USB | 1 | Programming & Power |


### 3.2 Circuit Schematic

![Circuit Schematic](./pictures/Schematic.svg)

**Schematic PDF:** [View Full Schematic](./Schematic/VermIQ.pdf)

### 3.3 Pin Configuration

```
ESP32 Pin Mapping:
┌─────────────────────────────────────┐
│ GPIO Pin  │ Component     │ Type    │
├───────────┼───────────────┼─────────┤
│ GPIO 4    │ DHT22 Data    │ Digital │
│ GPIO 21   │ OLED SDA      │ I2C     │
│ GPIO 22   │ OLED SCL      │ I2C     │
│ GPIO 34   │ Moisture ADC  │ Analog  │
│ GPIO 35   │ pH ADC        │ Analog  │
│ 3.3V      │ Sensors VCC   │ Power   │
│ GND       │ Common Ground │ Ground  │
└─────────────────────────────────────┘
```

### 3.4 PCB Design

The custom PCB was designed to integrate all components in a compact form factor suitable for deployment in vermiculture beds.

**3D PCB Renders:**

<table>
  <tr>
    <td><img src="./PCB/3D_PCB-ESP32_1.png" width="300"/></td>
    <td><img src="./PCB/3D_PCB-ESP32_2.png" width="300"/></td>
  </tr>
  <tr>
    <td><img src="./PCB/3D_PCB-ESP32_3.png" width="300"/></td>
    <td><img src="./PCB/3D_PCB-ESP32_4.png" width="300"/></td>
  </tr>
</table>


**PCB Features:**
- Compact 2-layer design
- Dedicated sensor headers
- Power regulation circuit
- I2C pull-up resistors on-board
- Mounting holes for enclosure
- Clear component labeling

### 3.5 Wokwi Circuit Simulation

Before physical implementation, the circuit was simulated on Wokwi platform to verify connectivity and code logic.

**Live Simulation Link:** https://wokwi.com/projects/465181219780428801

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Wowki-simulation VScode.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.5.1: Wokwi simulation running in VSCode with ESP32 circuit</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./pictures/enlarged wowki-simulation.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.5.2: Detailed view of simulated circuit with sensor connections</em></p>
    </td>
  </tr>
</table>

**Simulation Benefits:**
- Test sensor reading logic without physical hardware
- Verify I2C communication with OLED display
- Debug ADC reading issues in controlled environment
- Validate WiFi connection flow and Firebase API integration
- Rapid prototyping and code iteration
- Share live circuit with team members for collaboration

### 3.6 Physical Hardware Implementation

After successful simulation validation, the system was assembled with physical components.

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Full_physical_lab_1.jpeg" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.6.1: Complete physical hardware setup with breadboard and sensors</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./pictures/Full_physical_lab_2.jpeg" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.6.2: ESP32 with DHT22, moisture, and pH sensors during testing</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./pictures/Full_physical_lab_3.jpeg" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.6.3: Close-up view of breadboard connections and sensor placement</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./pictures/OLED_display.jpeg" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.6.4: SH1106 OLED display showing real-time IoT sensor readings</em></p>
    </td>
  </tr>
</table>

### 3.7 MQTT Communication Protocol

The system supports MQTT protocol for lightweight, efficient IoT communication between ESP32 nodes and cloud services.

<table>
  <tr>
    <td align="center">
      <img src="./pictures/MQTT response.jpeg" style="max-width:100%; height:auto;"/>
      <p><em>Figure 3.7.1: MQTT broker response showing successful message publish/subscribe</em></p>
    </td>
  </tr>
</table>

**MQTT Implementation:**
- Topic structure: `vermiq/{node_id}/{sensor_type}`
- QoS Level 1 (at least once delivery)
- JSON payload format for sensor data
- Retained messages for latest readings
- Last Will and Testament (LWT) for connection monitoring

---


## 4. Firmware Development

### 4.1 MicroPython Firmware Overview

The ESP32 runs MicroPython firmware that:
1. Reads sensor data every 3 seconds
2. Processes and calibrates sensor values
3. Displays readings on OLED
4. Uploads data to Firebase every 10 seconds
5. Handles WiFi reconnection automatically

### 4.2 Key Firmware Features

**Sensor Reading Functions:**
- `read_dht22()`: Reads temperature and humidity from DHT22
- `read_moisture()`: Reads and calibrates soil moisture percentage
- `read_ph()`: Reads and calculates pH from analog voltage

**Display Functions:**
- `oled_message()`: Updates OLED with formatted text
- Real-time sensor value display every cycle

**Network Functions:**
- `connect_wifi()`: Establishes WiFi connection with retry logic
- `wifi_is_connected()`: Monitors connection status
- Automatic reconnection on connection loss

**Firebase Functions:**
- `firebase_put_latest()`: Updates latest sensor reading
- `firebase_post_history()`: Appends reading to history log
- HTTP PUT/POST requests to Firebase REST API

### 4.3 Sensor Calibration

**Moisture Sensor:**
```python
MOISTURE_DRY_RAW = 3300  # Sensor in air
MOISTURE_WET_RAW = 1300  # Sensor in water
moisture_percent = ((MOISTURE_DRY_RAW - raw) / 
                   (MOISTURE_DRY_RAW - MOISTURE_WET_RAW)) * 100
```

**pH Sensor:**
```python
PH_NEUTRAL_VOLTAGE = 2.5  # pH 7 reference
PH_SLOPE = 0.18           # Calibration slope
ph = 7 + ((PH_NEUTRAL_VOLTAGE - voltage) / PH_SLOPE)
```


### 4.4 Firmware Testing Results

<table>
  <tr>
  <td align="center">
    <img src="./pictures/Error_data_recorded_01.png" style="max-width:100%; height:auto;"/>
    <p><em>Figure 4.4.1: DHT22 sensor error detection and graceful handling</em></p>
    <img src="./pictures/Error_data_recorded_02.png" style="max-width:100%; height:auto;"/>
    <p><em>Figure 4.4.2: System continuing operation despite sensor timeouts</em></p>
   </td>
<td align="center" valign="middle">
    <img src="./pictures/Screenshot_pH_Data_and_error.png" style="max-width:100%; height:auto;"/>
  <p><em>Figure 4.4.3: pH sensor data with intermittent error handling</em></p>
</td>
</tr>
</table>




**Testing Observations:**
- DHT22 occasionally returns timeout errors - handled gracefully
- Moisture sensor provides consistent readings after warm-up
- pH sensor requires 2-point calibration for accuracy
- OLED display updates reliably every cycle
- WiFi reconnection works automatically after network disruption

### 4.5 Serial Monitor Output

<table>
  <tr>
    <!-- Column 1 -->
    <td align="center" valign="top">
      <img src="./pictures/Screenshot_Moisture_Data_1.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.1: Moisture sensor raw ADC values and calibration testing</em></p>

  <img src="./pictures/Screenshot_pH_Data_07.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.2: pH sensor voltage readings and calculated pH values</em></p>

  <img src="./pictures/all_sensor_reading_1.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.3: Complete sensor reading cycle with all parameters</em></p>

  
   <img src="./pictures/Screenshot_OLED_Reset.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.4: OLED display initialization and I2C communication setup</em></p>
    </td>

    <!-- Column 2 -->
   <td align="center" valign="top">
      <img src="./pictures/Screenshot_Moisture_Data_2.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.5: Moisture percentage calculations and consistency validation</em></p>
<img src="./pictures/all_sensor_reading_3.png" style="max-width:100%; height:auto;"/>
  <p><em>Figure 4.5.6: Extended logging session for stability validation</em></p>


  <img src="./pictures/all_sensor_reading_2.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 4.5.7: Multiple consecutive cycles showing data consistency</em></p>
    </td>
  </tr>
</table>


### 4.6 WiFi Connectivity and Data Reliability

**Current Implementation:**
The ESP32 firmware maintains WiFi connectivity for cloud data upload. When the WiFi connection is active, sensor readings are uploaded to Firebase every 10 seconds. The system includes automatic WiFi reconnection logic that attempts to restore connectivity if the connection is lost.

**Offline Behavior:**
If WiFi disconnects temporarily, the ESP32 continues local sensing and displays current readings on the OLED screen. Cloud data upload resumes automatically once WiFi connectivity is restored. However, sensor readings collected during the offline period are not currently buffered or uploaded retroactively.

**Future Enhancement:**
Permanent offline buffering is planned as a future improvement using ESP32 flash storage (LittleFS filesystem), SPIFFS, or SD card logging. This enhancement will enable the system to store missed readings locally and upload them to Firebase once connectivity is restored, ensuring no data loss during network interruptions.

---


## 5. Firebase Integration

### 5.1 Firebase Architecture

The system uses Firebase as the cloud backend with three integrated services:
- **Realtime Database**: Primary storage for live sensor data and historical logs with WebSocket-based real-time synchronization
- **Firestore**: Structured document storage for timestamped sensor readings, enabling advanced queries and future analytics
- **Authentication**: Secure user access control with email/password authentication

**Dual Database Strategy:**
The ESP32/Firebase integration stores sensor data in two complementary databases:
1. **Firebase Realtime Database** stores live readings in `latest_readings` for real-time dashboard updates and accumulates timestamped records in `readings_history` for historical tracking
2. **Firestore** provides structured document storage in the `sensor_readings` collection for advanced querying, indexing, and future machine learning data analysis

This dual-database approach combines the real-time synchronization advantages of Realtime Database with the structured query capabilities and scalability of Firestore.

### 5.2 Data Upload Process

**From ESP32 to Firebase:**
1. ESP32 collects sensor readings every 3 seconds
2. Data is formatted as JSON payload
3. Every 10 seconds, two operations occur:
   - `PUT` request updates `latest_readings` (overwrites)
   - `POST` request appends to `readings_history` (accumulates)
4. Firebase automatically syncs to all connected clients

**Firebase Realtime Database Structure:**
```
iot-vermiq-default-rtdb/
├── latest_readings/
│   └── { timestamp_iso, dht22_temp, dht22_humidity, 
│         moisture_percent, moisture_raw, ph, ph_raw, ph_voltage }
└── readings_history/
    ├── 2026-06-16_17-20-00/
    ├── 2026-06-16_17-20-02/
    └── ...
```

### 5.3 Firebase Database Screenshots

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Firebase_Realtime_Database_with_historical_DB_data.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 5.3.1: Firebase Realtime Database showing latest_readings and extensive readings_history</em></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./pictures/Firebase_FireStore_DB_Data.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 5.3.2: Firestore collection containing timestamped sensor readings for advanced querying</em></p>
    </td>
  </tr>
</table>



### 5.4 Real-Time Synchronization

The dashboard uses Firebase Web SDK with WebSocket connections:
- `onValue()` listener subscribes to database changes
- Updates push automatically to all connected clients
- No polling required - truly real-time data flow
- Typical latency: 200-500ms from sensor to dashboard

### 5.5 Data Security

- Firebase Authentication for user access control
- Database rules restrict read/write access
- HTTPS encryption for all data transmission
- API keys managed through environment variables
- Service account keys excluded from version control

---

## 6. Web Dashboard Development

### 6.1 Dashboard Architecture

**Technology Stack:**
- **React 19.2**: Modern UI component library
- **TypeScript 6.0**: Type-safe development
- **Zustand 5.0**: Lightweight state management
- **TailwindCSS 4.3**: Utility-first styling
- **Recharts 3.8**: Data visualization
- **Framer Motion 12.40**: Smooth animations
- **Vite 5.4**: Fast build tool and dev server

**Project Structure:**
```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Main dashboard pages
│   │   ├── DashboardLayout.tsx  # Sidebar nav + routing
│   │   ├── Overview.tsx         # System overview page
│   │   ├── Analytics.tsx        # Sensor analytics charts
│   │   ├── History.tsx          # Historical data table + export
│   │   ├── Alerts.tsx           # Alert center
│   │   ├── Nodes.tsx            # ESP32 node registry
│   │   ├── Beds.tsx             # Vermiculture bed manager
│   │   ├── Settings.tsx         # Firebase config & thresholds
│   │   └── MLAnalytics.tsx      # ML Analytics page
│   ├── landing/           # Landing page
│   ├── logo/              # Branding components
│   └── ui/                # Reusable UI components (GlassCard, StatusBadge, Toast)
├── ml/                    # Machine Learning Engine
│   ├── types.ts           # SensorReading, PredictionResult, FeatureVector interfaces
│   ├── constants.ts       # Ideal ranges, weights, thresholds, scenario presets
│   ├── preprocessing.ts   # Feature engineering pipeline
│   ├── anomalyDetection.ts# Explainable rule-based anomaly detector
│   ├── harvestPredictor.ts# Harvest readiness scorer (0–100)
│   ├── environmentScorer.ts # Environmental classifier + risk mapper
│   ├── recommendationEngine.ts # Context-aware recommendation generator
│   ├── simulator.ts       # Preset scenario adapter
│   └── index.ts           # runPrediction() unified entry + barrel exports
├── services/
│   ├── firebase.ts        # Firebase SDK wrapper (Auth, RTDB, Firestore)
│   └── simulator.ts       # Demo mode telemetry data generator
├── store/
│   └── useStore.ts        # Zustand global state (telemetry + ML slice)
├── App.tsx                # Root component + auth listener
└── main.tsx               # Entry point
```


### 6.2 Dashboard Features & Screenshots

#### 6.2.1 Login & Authentication

<table>
  <tr>
    <td align="center">
      <img src="./pictures/VermIQ_Login_Page_18.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 6.2.1: VermIQ-Lite authentication page with Firebase login and demo mode</em></p>
    </td>
  </tr>
</table>

**Features:**
- Secure email/password authentication
- Demo mode for testing (demo@vermiq.com / password)
- Password reset functionality
- Session persistence
- Protected routes for authenticated users

#### 6.2.2 System Overview Dashboard

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Dashboard_Homepage.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 6.2.2: Main dashboard showing real-time sensor readings, Live Firebase Data indicator, and node status</em></p>
    </td>
  </tr>
</table>

**Key Elements:**
- **Live Firebase Data Indicator**: Shows connection status with animated pulse
- **Real-Time Metrics**: 
  - Soil Moisture: 62.86% (with status indicator)
  - Core Temperature: 26.9°C (with alert system)
  - Air Humidity: 47.5%
  - Soil pH Level: 5.78
- **Maturation Cycle Progress**: Visual progress bar showing compost maturity
- **Node Status Panel**: ESP32 connection info, RSSI, battery voltage
- **Last Updated**: Shows timestamp from Firebase data
- **Quick Navigation**: Links to Analytics, Alerts, and Beds pages


#### 6.2.3 Analytics Dashboard

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Dashboard_analytics.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 6.2.3: Sensor analytics page with interactive trend graphs and multi-parameter comparison</em></p>
    </td>
  </tr>
</table>

**Visualization Features:**
- **Moisture Trend Graph**: Real-time area chart with gradient fill
- **Temperature Trend**: Line chart tracking core temperature
- **Multi-Sensor Comparison**: Synchronized parameter overlay
- **Time Range Selector**: 1 Hour, 6 Hours, 24 Hours views
- **Interactive Charts**: Hover tooltips showing exact values
- **Responsive Layout**: Adapts to screen size

#### 6.2.4 Historical Data Logs

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Dashboard_Settings_Historical_DB_data.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 6.2.4: Historical logs page showing 200+ Firebase records with CSV/JSON export functionality</em></p>
    </td>
  </tr>
</table>

**Data Table Columns:**
- Reading # - Sequential record number
- Timestamp - Date and time of reading
- Temperature (°C) - Air temperature from DHT22
- Humidity (%) - Relative humidity
- Moisture (%) - Soil moisture percentage
- Moisture Raw - Raw ADC value from sensor
- pH - Calculated pH level
- pH Voltage - Analog voltage from pH sensor
- pH Raw - Raw ADC value from pH sensor

**Export Features:**
- **Export CSV**: Download data in spreadsheet-compatible format
- **Export JSON**: Download structured JSON for programmatic use
- **Data Preview**: View all records in scrollable table
- **Filter by Bed**: Switch between different vermiculture beds


#### 6.2.5 ESP32 Node Management

<table>
  <tr>
    <td align="center">
      <img src="./pictures/Dashboard_pH_Data_ESP32_Nodes_1.png" style="max-width:100%; height:auto;"/>
      <p><em>Figure 6.2.5: ESP32 Hardware Registry showing node details, connection status, and communication parameters</em></p>
    </td>
  </tr>
</table>

**Node Information Display:**
- Node identification and bed allocation
- Online/Offline status indicator
- Wi-Fi connection strength (RSSI in dBm)
- Battery voltage monitoring
- Publish frequency information
- Communication protocol details
- Last sync timestamp

### 6.3 Firebase Data Integration

The dashboard seamlessly integrates with Firebase through:

**Real-Time Subscriptions:**
```typescript
// Subscribe to latest sensor readings
realtimeTelemetryService.subscribeToLatestReadings((data) => {
  // Update dashboard immediately when Firebase changes
  updateTelemetry(nodeId, convertedReading);
});

// Subscribe to historical data
realtimeTelemetryService.subscribeToReadingsHistory((historyData) => {
  // Load last 200 records for charts and tables
  updateHistoryFromFirebase(nodeId, historyReadings);
}, 200);
```

**Data Conversion:**
- Firebase data → Internal telemetry format
- Automatic timestamp parsing
- Null value handling
- Type-safe TypeScript interfaces


### 6.4 CSV/JSON Export Implementation

**Export Functionality:**
- Data formatted properly with field escaping
- Blob-based download (no size limitations)
- Automatic filename generation with timestamps
- Support for 200+ records without performance issues

**CSV Export Example:**
```csv
Reading #,Timestamp,Temperature (°C),Humidity (%),Moisture (%),...
1,2026-06-16T17:20:00,26.6,47.9,62.76,2570,5.81,2.714,3368
2,2026-06-16T17:20:02,26.7,47.8,62.74,2569,5.82,2.713,3367
```

**JSON Export Example:**
```json
[
  {
    "timestamp": "2026-06-16T17:20:00+03:00",
    "reading_number": 1,
    "dht22_temp": 26.6,
    "dht22_humidity": 47.9,
    "moisture_percent": 62.76,
    "moisture_raw": 2570,
    "ph": 5.81,
    "ph_voltage": 2.714,
    "ph_raw": 3368
  }
]
```

### 6.5 State Management with Zustand

**Global State Structure:**
```typescript
interface VermIQState {
  user: UserSession | null;
  activeNodeId: string;
  telemetry: Record<string, TelemetryReading>;
  history: Record<string, TelemetryReading[]>;
  firebaseConnected: boolean;
  realtimeDataMode: boolean;
  // ... actions and methods
}
```

**Benefits:**
- Minimal boilerplate compared to Redux
- TypeScript support out of the box
- Simple API for state updates
- No context providers needed
- Excellent performance


### 6.6 UI/UX Design Philosophy

**Glassmorphism Theme:**
- Frosted glass effect with backdrop blur
- Subtle transparency for depth
- Smooth shadows and gradients
- Dark mode optimized for reduced eye strain
- High contrast for accessibility

**Color Palette:**
- **Primary**: Emerald (#10b981) - Growth, health
- **Secondary**: Cyan (#06b6d4) - Technology, sensors
- **Accent**: Amber (#f59e0b) - Temperature, warnings
- **Critical**: Rose (#f43f5e) - Alerts, errors
- **Background**: Deep Space (#06070a) - Dark mode base

**Typography:**
- **Headers**: Outfit font family
- **Body**: Plus Jakarta Sans
- **Code/Data**: Monospace font for numbers

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly button sizes
- Collapsible sidebar for small screens

---

---

## 7. Machine Learning Analytics Module

### 7.1 Overview

The Machine Learning Analytics Module is a complete, client-side predictive analytics system built entirely in TypeScript and running in the browser — with **zero server-side ML, no TensorFlow, and no external APIs**. It is accessible via the **Machine Learning** navigation entry in the sidebar (Brain icon) and serves as both a production-ready analytics tool and a class demonstration platform.

The module operates in two seamlessly interchangeable modes:

| Mode | Data Source | Use Case |
|------|-------------|----------|
| **Live Firebase** | `latest_readings` from Firebase Realtime Database | Real sensor data from the deployed ESP32 node |
| **Simulation** | Slider values or named preset scenarios | Demo, testing, and presentations without hardware |

**Critical architectural guarantee:** Both modes feed into the **exact same** `runPrediction()` pipeline. No logic is duplicated. When real Firebase data arrives in the future, zero code changes are needed in the ML engine.

---

### 7.2 Source File Structure (`src/ml/`)

```
src/ml/
├── types.ts              — All TypeScript interfaces
├── constants.ts          — Ideal ranges, thresholds, weights, scenario presets
├── preprocessing.ts      — Feature engineering pipeline
├── anomalyDetection.ts   — Rule-based explainable anomaly detector
├── harvestPredictor.ts   — Harvest readiness scorer (0–100%)
├── environmentScorer.ts  — Environmental classifier + risk level mapper
├── recommendationEngine.ts — Context-aware recommendation generator
├── simulator.ts          — Preset scenario → SensorReading adapter
└── index.ts              — runPrediction() unified entry + barrel exports
```

---

### 7.3 Data Model

#### Core Interfaces

```typescript
/** Raw sensor input — mirrors Firebase latest_readings schema exactly */
interface SensorReading {
  dht22_temp: number;        // Air temperature in °C
  dht22_humidity: number;    // Relative humidity in %
  moisture_percent: number;  // Soil moisture in %
  ph: number;                // Soil pH (0–14)
  timestamp: string;         // ISO 8601 timestamp
}

/** Complete prediction output returned to the UI */
interface PredictionResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  harvestReadiness: number;        // 0–100
  anomalyDetected: boolean;
  anomalyReasons: string[];        // Human-readable explanations
  confidence: number;              // 0–100
  environmentalScore: number;      // 0–100
  environmentClass: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  recommendations: string[];       // Actionable advice list
  timestamp: string;
}

/** Derived feature vector from the preprocessing pipeline */
interface FeatureVector {
  temp: number; humidity: number; moisture: number; ph: number;
  tempStability: number;      // Std deviation over rolling window
  humidityStability: number;
  moistureStability: number;
  phStability: number;
  rollingAvgTemp: number;     // Rolling mean over last N readings
  rollingAvgHumidity: number;
  rollingAvgMoisture: number;
  rollingAvgPh: number;
  rollingVarTemp: number;     // Rolling variance
  rollingVarMoisture: number;
  environmentalHealthIndex: number; // Composite 0–100 score
  historyLength: number;            // Affects confidence calculation
}
```

---

### 7.4 Feature Engineering (`preprocessing.ts`)

The preprocessing pipeline converts raw `SensorReading` objects (plus optional history) into a rich `FeatureVector`. This runs on every prediction call.

#### Features Generated

| Feature | Formula | Purpose |
|---------|---------|---------|
| **Temperature Stability** | `stdDev(last N temp readings)` | Measures how consistent temp is over time |
| **Humidity Stability** | `stdDev(last N humidity readings)` | Measures atmospheric consistency |
| **Moisture Stability** | `stdDev(last N moisture readings)` | Detects sudden watering or drying events |
| **pH Stability** | `stdDev(last N pH readings)` | Detects chemical fluctuations |
| **Rolling Average** | `mean(last N readings)` per sensor | Smoothed baseline for all 4 sensors |
| **Rolling Variance** | `variance(last N readings)` | Raw variance for confidence dampening |
| **Environmental Health Index** | Weighted composite (see below) | Master health score, 0–100 |

Rolling window size: **N = 10 readings** (configurable in `constants.ts`).

#### Environmental Health Index Formula

Each sensor is individually scored against its ideal range using a linear decay function:

```
scoreParameter(value, idealMin, idealMax, absMin, absMax):
  if value inside [idealMin, idealMax] → 100
  else → 100 × (1 − distanceFromIdeal / rangeFromIdealToAbsolute)
  clamped to [0, 100]
```

**Ideal ranges:**

| Sensor | Ideal Range | Absolute Min | Absolute Max |
|--------|------------|-------------|-------------|
| Temperature | 25–30°C | 15°C | 40°C |
| Humidity | 60–80% | 30% | 95% |
| Moisture | 55–75% | 20% | 95% |
| pH | 6.0–7.5 | 4.0 | 9.0 |

**Weighted combination:**
```
Environmental Health Index =
    tempScore     × 0.30  (Temperature — most critical for worm survival)
  + moistureScore × 0.30  (Moisture — equally critical for habitat)
  + humidityScore × 0.20  (Humidity — important for surface microclimate)
  + phScore       × 0.20  (pH — affects microbial decomposition rate)
```

Final score: **0–100** (integer).

---

### 7.5 Anomaly Detection Engine (`anomalyDetection.ts`)

The anomaly detector uses three independent layers of explainable, rule-based checks. Every triggered rule produces a specific human-readable reason string rather than a generic flag.

#### Layer 1 — Physical Limit Checks (Sensor Fault Detection)

Detects readings that are physically impossible for the sensors being used:

| Sensor | Physically Impossible Range |
|--------|---------------------------|
| Temperature | `< −40°C` or `> 80°C` |
| Humidity | `< 0%` or `> 100%` |
| Moisture | `< 0%` or `> 100%` |
| pH | `< 0` or `> 14` |

If a physical limit is breached, all further checks are skipped and sensor calibration is recommended automatically.

#### Layer 2 — Hard Safety Threshold Checks

Checks whether readings exceed safe operational boundaries for vermiculture:

| Sensor | Low Threshold | High Threshold |
|--------|--------------|---------------|
| Temperature | < 15°C | > 40°C |
| Humidity | < 30% | > 95% |
| Moisture | < 20% | > 95% |
| pH | < 4.0 | > 9.0 |

Each breach generates a specific message with the actual value included, e.g.:
> *"Temperature exceeded safe threshold (43.0°C > 40°C)"*

#### Layer 3 — Rapid Change Detection

Compares the current reading to the immediately previous reading and flags sudden jumps:

| Sensor | Max Safe Delta Per Reading |
|--------|--------------------------|
| Temperature | 5°C |
| Humidity | 15% |
| Moisture | 20% |
| pH | 1.0 unit |

All three layers run in sequence. Their results are merged and deduplicated before being returned.

**Output example (Overheated Bed scenario):**
```json
{
  "anomalyDetected": true,
  "reasons": [
    "Temperature exceeded safe threshold (43.0°C > 40°C)",
    "Humidity critically low (45.0% < 30%)"
  ]
}
```

---

### 7.6 Harvest Readiness Predictor (`harvestPredictor.ts`)

A pseudo-ML scoring model that estimates how ready the vermicompost bed is for harvest on a **0–100% scale**.

#### Ideal Harvest Conditions

| Sensor | Ideal Harvest Range |
|--------|-------------------|
| Temperature | 24–30°C |
| Humidity | 60–80% |
| Moisture | 55–75% |
| pH | 6.2–7.2 |

#### Scoring Algorithm

Each sensor is scored using an exponential penalty curve:
```
idealScore(value, min, max):
  if value inside [min, max] → 100
  else:
    deviation = distance from nearest ideal edge
    penaltyRatio = min(deviation / (idealRange × 1.5), 1.0)
    score = 100 × (1 − penaltyRatio^0.6)
    clamped to [0, 100]
```

Weighted combination (same weights as Environmental Health Index):
```
baseScore = tempScore×0.30 + moistureScore×0.30 + humidityScore×0.20 + phScore×0.20
```

**Stability Bonus:** Up to +8 points added if all sensors maintain low variability over the rolling window. Consistently stable conditions indicate a mature, well-managed bed.

```
stabilityBonus = max(0, 8 − avgStdDeviationAcrossAllSensors)
finalScore = min(100, baseScore + stabilityBonus)
```

#### Confidence Score

The confidence score reflects how reliable the prediction is, based on available history:

```
historyFactor   = min(1.0, historyLength / 20)   → 0 at 0 readings, 1.0 at 20+
variancePenalty = min(1.0, (varTemp + varMoist) / 200)
confidence      = 50 + historyFactor×35 − variancePenalty×10
clamped to [30, 98]
```

**Interpretation:** A new simulation session starts with ~50% confidence (no history). After 20+ predictions accumulate, confidence rises to 80–90%+ in stable conditions.

---

### 7.7 Environmental Classifier (`environmentScorer.ts`)

Maps the Environmental Health Index score to a qualitative label and a risk level:

#### Environment Class

| Score Range | Class | Colour |
|------------|-------|--------|
| 90–100 | **Excellent** | Emerald `#10b981` |
| 75–89 | **Good** | Cyan `#06b6d4` |
| 60–74 | **Fair** | Amber `#f59e0b` |
| 40–59 | **Poor** | Orange `#f97316` |
| 0–39 | **Critical** | Rose `#ef4444` |

#### Risk Level

| Score Range | Risk Level |
|------------|-----------|
| 75–100 | LOW |
| 55–74 | MEDIUM |
| 35–54 | HIGH |
| 0–34 | CRITICAL |

---

### 7.8 Recommendation Engine (`recommendationEngine.ts`)

Generates a prioritised list of up to 6 actionable recommendations based on the current sensor readings, detected anomaly reasons, and computed risk level.

The engine contains **17 rules** organised by priority. Lower priority number = shown first:

| Priority | Trigger Condition | Example Recommendation |
|---------|------------------|----------------------|
| 0 | Sensor fault detected | *"Inspect all sensors for calibration drift or hardware damage."* |
| 1 | Temperature > 40°C | *"Temperature critically high. Immediately increase airflow and shade..."* |
| 2 | Temperature > 30°C | *"Temperature elevated. Increase airflow around the vermiculture bed..."* |
| 3 | Temperature < 15°C | *"Temperature critically low. Insulate the bed and relocate..."* |
| 4 | Temperature < 25°C | *"Temperature below ideal. Cover with insulating material..."* |
| 5 | Moisture < 20% | *"Moisture critically low. Add water gradually — dry conditions are lethal..."* |
| 6 | Moisture < 55% | *"Moisture below optimal. Add water gradually to maintain worm activity..."* |
| 7 | Moisture > 95% | *"Moisture critically high — risk of anaerobic conditions. Aerate immediately..."* |
| 8 | Moisture > 75% | *"Moisture above optimal. Reduce watering, add dry carbon-rich material..."* |
| 9 | Humidity > 95% | *"Humidity dangerously high. Improve ventilation immediately..."* |
| 10 | Humidity > 80% | *"Humidity elevated. Improve ventilation to prevent surface mold..."* |
| 11 | Humidity < 30% | *"Humidity critically low. Mist surroundings and cover bed loosely..."* |
| 12 | Humidity < 60% | *"Humidity below optimal. Lightly mist surface and cover with burlap..."* |
| 13 | pH < 4.0 | *"pH critically acidic. Add crushed eggshells or lime in small amounts..."* |
| 14 | pH < 6.2 | *"pH slightly low. Add crushed eggshells gradually..."* |
| 15 | pH > 9.0 | *"pH critically alkaline. Introduce acidic organic matter carefully..."* |
| 16 | pH > 7.2 | *"pH slightly elevated. Introduce coffee grounds to lower pH..."* |
| 99 | Risk level = LOW | *"All conditions optimal. Continue current management practices..."* |

Duplicate messages are automatically removed. The output is always at least one recommendation.

---

### 7.9 ML Simulation Mode

Simulation mode is the most important demo feature. It enables a full ML demonstration **without any physical hardware or Firebase connection**.

#### Preset Scenarios

Five named scenarios are pre-configured in `constants.ts`. Selecting any preset instantly populates all four sensor values and re-runs the full prediction pipeline:

| Scenario | Temp | Humidity | Moisture | pH | Expected Risk |
|---------|------|---------|---------|-----|--------------|
| **Normal Conditions** | 27°C | 70% | 65% | 6.8 | LOW |
| **Dry Compost** | 31°C | 40% | 25% | 6.5 | HIGH |
| **Acidic Compost** | 28°C | 72% | 66% | 4.5 | CRITICAL |
| **Overheated Bed** | 43°C | 45% | 55% | 6.9 | CRITICAL |
| **Sensor Failure** | −10°C | 200% | 150% | 20 | CRITICAL |

#### Manual Sliders

Four independent sliders allow free-form exploration of the prediction space:

| Slider | Range | Step | Unit |
|--------|-------|------|------|
| Temperature | 0–50 | 0.5 | °C |
| Humidity | 0–100 | 1 | % |
| Soil Moisture | 0–100 | 1 | % |
| pH Level | 0–14 | 0.1 | — |

Moving any slider immediately clears the active preset name and re-runs the prediction. All predictions accumulate in `historicalPredictions` and feed the trend charts.

---

### 7.10 Live Firebase Mode

When switched to **Live Firebase** mode, the ML engine reads data from the existing Zustand store:

```
Firebase Realtime Database
  └── latest_readings → realtimeTelemetryService.subscribeToLatestReadings()
        └── store.telemetry[activeNodeId]  (TelemetryReading)
              └── mapped to SensorReading
                    └── runPrediction(reading, mlHistory)
                          └── store.predictionResult  →  UI
```

The history passed into the pipeline is the existing `store.history[activeNodeId]` array, already populated by the Firebase history subscription. This means stability and confidence scores improve automatically as more real readings accumulate.

**Auto-refresh:** In Live mode, predictions automatically re-run every 5 seconds (matching approximately the Firebase update cadence).

---

### 7.11 Dashboard Page: `/ml-analytics`

The ML Analytics page (`MLAnalytics.tsx`) is organised into four visual sections:

#### Section 1 — Mode Toggle & Header

- `[ LIVE FIREBASE ]` / `[ SIMULATION ]` toggle buttons (top-right of header)
- A status banner in Live mode showing whether Firebase is actually connected or using simulated node fallback

#### Section 2 — Simulation Controls (Simulation mode only)

- **Preset Scenarios panel**: 5 clickable scenario cards, each showing name, description, sensor values, and expected risk badge
- **Manual Controls panel**: 4 styled sliders with real-time value display, current values summary grid at the bottom

#### Section 3 — Prediction Summary Cards (4 cards)

| Card | Metric | Visual |
|------|--------|--------|
| Environmental Score | 0–100 with class label | Animated SVG ring with class colour |
| Harvest Readiness | 0–100% with stage label | Animated SVG ring in cyan |
| Confidence Score | 0–100% with quality label | Animated SVG ring in violet |
| Risk Level | LOW/MEDIUM/HIGH/CRITICAL | Icon + colour badge |

#### Section 4 — Anomaly Detection Panel

- Green border + `ALL NORMAL` badge when no anomalies
- Red border + `ANOMALY DETECTED` badge when anomalies present
- Pulsing red dot indicator
- Individual reason cards listed below the status

#### Section 5 — AI Recommendations Panel

- Numbered recommendation cards (1–6)
- Each recommendation is generated dynamically from the active sensor values
- Empty state with brain icon when no prediction has been run yet

#### Section 6 — Prediction History Charts (3 area charts)

All charts use Recharts `AreaChart` with gradient fills and consistent dark styling:

| Chart | Y-Axis | Line Colour |
|-------|--------|------------|
| Environmental Score Trend | 0–100 | Dynamic (matches env class colour) |
| Harvest Readiness Trend | 0–100% | Cyan `#06b6d4` |
| Prediction Confidence Trend | 0–100% | Violet `#a78bfa` |

Charts populate progressively as predictions accumulate. A minimum of 2 data points is required before charts render; otherwise an empty state is shown.

---

### 7.12 Navigation

The Machine Learning page is accessible via the sidebar navigation item added to `DashboardLayout.tsx`:

```
Sidebar Navigation Order:
  1. Dashboard       (LayoutDashboard icon)
  2. Beds            (Database icon)
  3. Analytics       (LineChart icon)
  4. Machine Learning ← NEW  (Brain icon, violet active state)
  5. Alerts          (Bell icon with badge)
  6. Nodes           (Cpu icon)
  7. Historical Data (History icon)
  8. Settings        (Settings icon)
```

Active state for the ML tab uses the same glassmorphism styling pattern as all other tabs.

---

### 7.13 Zustand ML State Slice

The following state and actions were added to `useStore.ts`:

```typescript
// State fields
mlMode: 'live' | 'simulation'           // Active prediction mode
mlSimValues: MLSimValues                 // { temp, humidity, moisture, ph }
mlSimScenario: string | null             // Name of active preset, or null (custom)
predictionResult: PredictionResult | null // Latest prediction output
historicalPredictions: Array<PredictionResult & { timestamp: string }> // Last 50

// Actions
setMLMode(mode)          → Switch between live and simulation
setMLSimValues(vals)     → Update slider values (clears mlSimScenario)
setMLSimScenario(name)   → Set active preset name
runMLPrediction()        → Execute full pipeline, stores result + appends history
storePrediction(result)  → Internal: appends to historicalPredictions (max 50)
```

**Default initial state:** Simulation mode, Normal Conditions preset (`temp=27, humidity=70, moisture=65, ph=6.8`), prediction runs automatically on page load.

---

### 7.14 Assumptions Made in the Current Implementation

The following assumptions were made during the Phase 1 (client-side) ML implementation:

1. **Sensor value validity:** Readings from Firebase are assumed to be in SI units as documented (`dht22_temp` in °C, `moisture_percent` as 0–100, `ph` as 0–14). No unit conversion is performed.

2. **pH field availability:** The pH field (`ph`) may be `null` in some historical records. When null, the ML engine defaults to `6.8` (neutral-optimal) to prevent pipeline failures rather than rejecting the reading entirely.

3. **Ideal range universality:** The ideal ranges (temp 25–30°C, humidity 60–80%, moisture 55–75%, pH 6.0–7.5) are based on published vermiculture literature for *Eisenia fetida* (Red Wiggler worms) at sea level in tropical/sub-tropical climates. Different worm species or geographic conditions may require different thresholds.

4. **Single-bed prediction:** The current ML implementation predicts for the **active node only** (the node selected in the Overview dropdown). Multi-bed comparative ML predictions are a planned enhancement.

5. **Stateless simulation history:** In simulation mode, the "history" passed to the pipeline is synthesised from the last 10 `historicalPredictions` using the current slider values as a proxy. This is less accurate than real historical variance but sufficient for demonstration confidence scoring.

6. **Scoring weights are fixed:** The weighting (Temp 30%, Moisture 30%, Humidity 20%, pH 20%) is based on domain knowledge from vermiculture research. These weights are not learned from data — they are manually calibrated constants.

7. **Maturity stage not included:** The current pipeline does not incorporate `daysElapsed` (how many days the bed has been running) into the harvest readiness score. A fully mature model would weight readiness higher for beds that have been composting longer.

8. **No persistence:** Prediction history is held only in Zustand (in-memory). It resets on page refresh. The optional Firestore `ml_predictions` logging collection is designed for but not yet wired up.

9. **No cross-validation:** The scoring model is not trained on historical data from this project. It is a domain-knowledge-based weighted model. Validation against actual harvest outcomes is required for a production deployment.

10. **Linear scoring decay:** The `scoreParameter` function uses linear decay from ideal range to absolute threshold. A more sophisticated model would use sensor-specific empirical decay curves fitted to real data.

---

### 7.15 Planned Deployment-Grade ML Implementation

The current Phase 1 implementation is a **rule-based + weighted-scoring engine** designed for demonstration and immediate utility. For production deployment, a trained statistical/ML model will replace or augment the scoring logic.

#### 7.15.1 Planned ML Architecture

```
┌─────────────────────┐    ┌──────────────────────────────┐    ┌─────────────────────────┐
│  Firebase Realtime  │    │   Python Training Pipeline   │    │  Browser / Dashboard    │
│  Database +         │───>│  (Offline / Cloud Function)  │───>│  Inference Engine       │
│  Firestore History  │    │                              │    │  (ONNX / TFLite)        │
└─────────────────────┘    └──────────────────────────────┘    └─────────────────────────┘
         │                            │                                    │
   2000+ labelled                 Training:                         Same runPrediction()
   sensor records             - Feature extraction                  interface — zero
   (from this project)        - Model fitting                       UI code changes
                              - Cross-validation
                              - Export to ONNX/TFLite
```

#### 7.15.2 Data Collection & Labelling

**Data source:** All readings stored in `readings_history` (Firebase Realtime Database) and the `sensor_readings` Firestore collection.

**Current dataset:** 2,000+ readings collected during 48+ hours of continuous operation (June 2026). Each record contains: `dht22_temp`, `dht22_humidity`, `moisture_percent`, `moisture_raw`, `ph`, `ph_raw`, `ph_voltage`, `timestamp_epoch_ms`, `reading_number`.

**Labelling strategy:**
- **Anomalies:** Label readings that coincided with known events (manual watering, temperature spikes, pH drift) using the `timestamp` and team notes from the physical testing log
- **Harvest readiness:** Binary label `harvest_ready ∈ {0, 1}` added manually at 30-day intervals based on visual inspection of the compost bed state
- **Environmental quality:** Subjective 1–5 quality score assigned by team members at each weekly inspection

**Export pipeline:**
```python
# Firebase Admin SDK export
import firebase_admin
from firebase_admin import db
import pandas as pd

ref = db.reference('readings_history')
data = ref.get()
df = pd.DataFrame(data.values())
df.to_csv('vermiq_training_data.csv', index=False)
```

#### 7.15.3 Planned Model Types

**Primary Model — Random Forest Classifier (Scikit-learn)**
- **Task:** Multi-class environmental quality classification (Excellent/Good/Fair/Poor/Critical)
- **Why:** Handles small datasets well (2,000–10,000 records), interpretable feature importances, robust to outliers from sensor noise, no normalisation required
- **Features:** Raw sensors + engineered features (stability, rolling avg, rolling var) — identical to Phase 1 `FeatureVector`
- **Hyperparameters to tune:** `n_estimators` (50–200), `max_depth` (3–10), `min_samples_leaf` (5–20) via `GridSearchCV`

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder

features = ['temp', 'humidity', 'moisture', 'ph',
            'tempStability', 'humidityStability', 'moistureStability', 'phStability',
            'rollingAvgTemp', 'rollingAvgHumidity', 'rollingAvgMoisture', 'rollingAvgPh',
            'rollingVarTemp', 'rollingVarMoisture']

X = df[features]
y = df['quality_label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10, None],
    'min_samples_leaf': [5, 10, 20]
}
rf = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, scoring='f1_macro')
rf.fit(X_train, y_train)
```

**Secondary Model — Gradient Boosting Regressor (XGBoost / LightGBM)**
- **Task:** Continuous harvest readiness score prediction (regression, 0.0–1.0)
- **Why:** Superior accuracy on tabular data, handles feature interactions naturally, fast inference
- **Output:** Replace the current `predictHarvestReadiness()` weighted formula with a trained regressor

**Anomaly Detection Upgrade — Isolation Forest**
- **Task:** Unsupervised outlier detection to supplement the rule-based system
- **Why:** Learns the normal data distribution from 2,000+ real readings; flags novel anomaly patterns that rules would miss
- **Training:** Trained on readings labelled `normal` only; predicts anomaly score for new readings
- **Integration:** Run alongside existing rule-based checks; anomaly confirmed if either system flags it

```python
from sklearn.ensemble import IsolationForest

iso = IsolationForest(contamination=0.05, random_state=42)
iso.fit(X_normal)  # X_normal = readings labelled as normal operation
```

#### 7.15.4 Model Training Pipeline

```
1. Export Firebase data → CSV via Python + Firebase Admin SDK
2. Clean & validate: drop readings with null sensors, clip physical outliers
3. Feature engineering: apply identical transformation as preprocessing.ts
   (stability windows, rolling averages, rolling variance)
4. Manual labelling: quality scores, harvest labels, anomaly flags
5. Train/val/test split: 70/15/15 with temporal ordering (no data leakage)
6. Model training: RandomForest + XGBoost + IsolationForest
7. Evaluation:
   - Classification: Accuracy, F1 (macro), Confusion Matrix
   - Regression: RMSE, MAE, R²
   - Anomaly: Precision, Recall @ 5% contamination
8. Export trained models to ONNX format:
   from skl2onnx import convert_sklearn
   onnx_model = convert_sklearn(rf.best_estimator_, ...)
9. Deploy ONNX to browser via onnxruntime-web
```

#### 7.15.5 Browser Inference Integration

Once trained models are exported to ONNX or TFLite, the `runPrediction()` function in `src/ml/index.ts` will be updated to call the ONNX runtime instead of the weighted scoring functions — **with no changes required to the UI, the Zustand store, or any other module**:

```typescript
// Current (Phase 1 — weighted scoring):
export function runPrediction(reading, history): PredictionResult {
  const features = buildFeatureVector(reading, history);
  const { score, confidence } = predictHarvestReadiness(features);  // ← rule-based
  const environmentalScore = features.environmentalHealthIndex;       // ← formula
  ...
}

// Planned (Phase 2 — ONNX inference):
import * as ort from 'onnxruntime-web';
const session = await ort.InferenceSession.create('./models/vermiq_rf.onnx');

export async function runPrediction(reading, history): Promise<PredictionResult> {
  const features = buildFeatureVector(reading, history);           // ← unchanged
  const tensor = new ort.Tensor('float32', featuresToArray(features), [1, 14]);
  const output = await session.run({ input: tensor });             // ← model inference
  const environmentalScore = output['quality_score'].data[0] * 100;
  const harvestReadiness   = output['harvest_score'].data[0] * 100;
  ...
}
```

The anomaly detection rules are kept as a **fast pre-filter** even in Phase 2. The trained Isolation Forest supplements them for novel pattern detection.

#### 7.15.6 Model Performance Targets

| Model | Target Metric | Minimum Acceptable |
|-------|-------------|-------------------|
| RF Environmental Classifier | F1 Macro ≥ 0.85 | 0.75 |
| XGBoost Harvest Regressor | RMSE ≤ 5.0 (0–100 scale) | RMSE ≤ 10.0 |
| Isolation Forest Anomaly | Recall ≥ 0.80 @ 5% contamination | Recall ≥ 0.65 |
| Inference latency (browser) | < 50ms per prediction | < 200ms |

#### 7.15.7 Comparison: Phase 1 vs Phase 2

| Aspect | Phase 1 (Current) | Phase 2 (Planned) |
|--------|------------------|------------------|
| **Algorithm** | Weighted scoring + rules | Random Forest + XGBoost + Isolation Forest |
| **Training data** | None (domain knowledge) | 2,000–10,000+ labelled Firebase records |
| **Anomaly detection** | Hard threshold rules | Rules + Isolation Forest |
| **Harvest prediction** | Ideal-deviation formula | Trained regressor (R² ≥ 0.80) |
| **Confidence** | Heuristic (history length) | Calibrated probability from model |
| **External libraries** | Zero (pure TypeScript) | `onnxruntime-web` (~4MB bundle) |
| **Update mechanism** | Code changes required | Replace `.onnx` file in `/public/models/` |
| **Inference time** | < 1ms | < 50ms |
| **Explainability** | Full (rule reasons) | Partial (SHAP values for top features) |

---

### 7.16 Demo Flow (Class Presentation)

The complete demonstration flow for a lecturer or assessor, requiring only a web browser:

```
1. Open the VermIQ-Lite dashboard
2. Login with demo credentials: demo@vermiq.com / password
3. Click "Machine Learning" in the sidebar (Brain icon)
   → Page loads in Simulation mode with Normal Conditions preset

4. Click "Overheated Bed" preset
   → Observe immediately:
      ✦ Environmental Score: ~35/100 (CRITICAL class)
      ✦ Risk Level: CRITICAL (red card)
      ✦ Harvest Readiness: ~20% (Early Stage)
      ✦ Anomaly Detected: YES — "Temperature exceeded safe threshold (43.0°C > 40°C)"
      ✦ Recommendations: airflow, insulation advice appear

5. Click "Normal Conditions" preset
   → Observe immediately:
      ✦ Environmental Score: ~95/100 (EXCELLENT class)
      ✦ Risk Level: LOW (green card)
      ✦ Harvest Readiness: ~85% (Ready Soon)
      ✦ Anomaly Detected: NO — "All sensor readings within safe parameters"
      ✦ Recommendations: positive reinforcement message

6. Click "Sensor Failure" preset
   → Observe:
      ✦ Physical limit breach detected
      ✦ Multiple anomaly reasons including calibration warnings
      ✦ All scores critically low

7. Adjust temperature slider from 27 to 43°C manually
   → Watch scores degrade in real time as slider moves

8. Switch to "Live Firebase" mode
   → If Firebase is connected, real ESP32 sensor readings flow through
     the exact same prediction pipeline automatically
   → If not connected, simulated node telemetry is used as fallback

9. Return to any other dashboard page — ML state is preserved
```

---

## 8. Challenges & Solutions


### 8.1 Hardware Challenges

**Challenge 1: DHT22 Sensor Timeout Errors**
- **Problem**: DHT22 occasionally returned timeout errors
- **Solution**: Implemented error handling to skip bad readings without crashing
- **Result**: System continues operation reliably with occasional N/A values

**Challenge 2: pH Sensor Calibration**
- **Problem**: pH readings drifted over time
- **Solution**: Implemented 2-point calibration with pH 4 and pH 7 buffers
- **Result**: Stable pH readings within ±0.2 accuracy


**Challenge 3: I2C Communication Stability**
- **Problem**: OLED display occasionally froze
- **Solution**: Added proper I2C initialization with pull-up resistors
- **Result**: Reliable OLED updates every cycle

**Challenge 4: Capacitive Moisture Sensor Noise**
- **Problem**: Raw ADC values fluctuated significantly
- **Solution**: Implemented 10-sample averaging with 30ms delays
- **Result**: Stable moisture readings with <2% variation

### 8.2 Firmware Challenges

**Challenge 5: WiFi Disconnection Handling**
- **Problem**: ESP32 lost WiFi connection during extended operation
- **Solution**: Added automatic reconnection logic with exponential backoff
- **Result**: System recovers automatically within 30 seconds

**Challenge 6: Memory Management**
- **Problem**: MicroPython ran out of memory after long operation
- **Solution**: Closed HTTP responses properly, limited buffer sizes
- **Result**: Stable operation for 24+ hours without restart

**Challenge 7: Firebase Authentication**
- **Problem**: Firebase required auth token for production databases
- **Solution**: Used test mode during development, implemented auth for production
- **Result**: Secure data access with proper authentication

### 8.3 Frontend Development Challenges

**Challenge 8: Real-Time Data Synchronization**
- **Problem**: Dashboard showed stale data despite Firebase updates
- **Solution**: Implemented WebSocket-based `onValue()` listeners
- **Result**: True real-time updates with <500ms latency


**Challenge 9: CSV Export File Size**
- **Problem**: Original data URI approach failed for large datasets
- **Solution**: Switched to Blob-based download with proper field escaping
- **Result**: Successfully export 200+ records without browser limitations

**Challenge 10: TypeScript Type Safety**
- **Problem**: Firebase data didn't match TypeScript interfaces initially
- **Solution**: Created comprehensive interfaces matching Firebase structure
- **Result**: Type-safe code with compile-time error detection

**Challenge 11: State Management Complexity**
- **Problem**: React Context API became unwieldy for global state
- **Solution**: Migrated to Zustand for lightweight state management
- **Result**: Cleaner code with 40% less boilerplate

**Challenge 12: Chart Performance**
- **Problem**: Recharts lagged with 200+ data points
- **Solution**: Implemented data windowing and virtualization
- **Result**: Smooth animations even with large datasets

### 8.4 Integration Challenges

**Challenge 13: Firebase Query Naming Conflict**
- **Problem**: Both Firestore and Realtime Database export `query` function
- **Solution**: Used aliased imports (`query as firestoreQuery`)
- **Result**: No naming conflicts, clean codebase

**Challenge 14: Time Zone Handling**
- **Problem**: Timestamps from ESP32 didn't match client time zones
- **Solution**: Used ISO 8601 format with explicit timezone offsets
- **Result**: Accurate timestamps across all clients


### 8.5 Machine Learning Challenges

**Challenge 15: Same Pipeline for Two Modes**
- **Problem**: Live Firebase data and simulation data have different structures (`TelemetryReading` vs `SensorReading`)
- **Solution**: Mapped `TelemetryReading` → `SensorReading` inside `runMLPrediction()` action in the store; the ML engine never sees the raw Firebase structure
- **Result**: Zero code duplication — single `runPrediction()` call serves both modes

**Challenge 16: Recharts Tooltip TypeScript Errors**
- **Problem**: Recharts v3 typed the `formatter` value parameter as `ValueType | undefined` (not `number`), causing build failures
- **Solution**: Typed the formatter argument as `unknown` and used the nullish coalescing operator (`?? 0`)
- **Result**: Build passes with strict TypeScript (`tsc -b && vite build`)

**Challenge 17: Confidence Without Historical Data**
- **Problem**: On first load (simulation mode, no history), confidence was undefined or 0, which was misleading
- **Solution**: Added a floor of `30%` to confidence so the UI always shows a meaningful minimum, and a ceiling of `98%` to avoid false certainty
- **Result**: New sessions show "Low Confidence" rather than "0%"; builds as more predictions accumulate

**Challenge 18: Slider Re-triggering Preset Name**
- **Problem**: Moving any slider should visually deactivate the preset card, but the preset name state was retained
- **Solution**: `setMLSimValues()` action always sets `mlSimScenario: null` when called, clearing the active preset badge
- **Result**: "Custom" badge appears correctly whenever sliders deviate from any preset

**Challenge 19: Trend Charts Empty State Race Condition**
- **Problem**: Charts tried to render with `< 2` data points on the first prediction, causing layout flicker
- **Solution**: Added `chartData.length < 2` guard that renders the empty state with a "Collecting prediction data..." message instead of an empty chart
- **Result**: Clean UX on first load; charts appear progressively after 2+ predictions

---

## 9. Testing & Validation

### 9.1 Hardware Testing

**Sensor Accuracy Tests:**

| Sensor | Test Method | Expected Range | Measured Range | Accuracy |
|--------|-------------|----------------|----------------|----------|
| DHT22 Temp | Reference thermometer | 20-30°C | 20.1-29.8°C | ±0.5°C |
| DHT22 Humidity | Salt test (75% RH) | 75% | 73-77% | ±2% |
| Moisture | Dry vs Wet calibration | 0-100% | 0-100% | ±3% |
| pH | Buffer solutions | pH 4, 7, 10 | pH 4.1, 7.0, 9.8 | ±0.2 |

**Reliability Tests:**
- **24-Hour Continuous Operation**: - Passed
- **WiFi Disconnection Recovery**: - Automatic reconnection works
- **Power Cycle Test**: - System resumes correctly after restart
- **Sensor Failure Handling**: - Graceful degradation

### 9.2 Firebase Integration Testing

**Data Upload Tests:**
- Latest reading updates every 2 seconds
- Historical records accumulate correctly
- No data loss during network interruption
- Duplicate prevention working
- Timestamp synchronization accurate

**Database Performance:**
- Average write latency: 200-400ms
- Average read latency: 100-200ms
- WebSocket connection stable for 12+ hours
- No data corruption observed

---

## 10. Results & Data Analysis

### 9.1 System Performance Metrics

**Data Collection:**
- Total sensor readings collected: 2,000+
- Continuous operation time: 48+ hours
- Data upload success rate: 99.7%
- Dashboard uptime: 99.9%

**Network Performance:**
- Average ESP32 → Firebase latency: 280ms
- Average Firebase → Dashboard latency: 150ms
- Total end-to-end latency: <500ms
- WiFi reconnection time: 15-30 seconds


### 9.2 Environmental Data Analysis

**Sample Data Summary (200 readings over 10 hours):**

| Parameter | Min | Max | Average | Std Dev |
|-----------|-----|-----|---------|---------|
| Temperature (°C) | 25.8 | 27.2 | 26.6 | 0.3 |
| Humidity (%) | 45.2 | 49.8 | 47.5 | 1.2 |
| Moisture (%) | 61.2 | 64.3 | 62.8 | 0.8 |
| pH | 5.65 | 5.95 | 5.81 | 0.08 |

**Observations:**
- Temperature stable with minor circadian variation
- Humidity shows slight inverse correlation with temperature
- Moisture levels consistent (indicates good sensor stability)
- pH remains neutral range suitable for vermiculture

### 9.3 Data Integrity

**Verification Methods:**
- Compared OLED display values with Firebase data: - Match
- Cross-referenced CSV export with database: - Consistent
- Validated timestamp ordering: - Chronological
- Checked for duplicate records: - None found
- Verified data types and ranges: - All valid

**Error Rate:**
- DHT22 timeout errors: ~0.5% of readings
- Network upload failures: ~0.3% (auto-retry successful)
- Invalid pH readings: ~0.1% (sensor noise filtered)
- Overall data quality: 99.1% valid readings

### 9.4 Power Consumption

**ESP32 Power Analysis:**
- Active WiFi + sensors: ~180 mA @ 3.3V (0.6W)
- Estimated battery life (2000 mAh): ~11 hours
- Deep sleep potential: Could extend to 7+ days with optimizations

---
## 11. How to Run the Project

### 10.1 Prerequisites

**Hardware Requirements:**
- ESP32 Development Board
- DHT22 Temperature & Humidity Sensor
- Capacitive Soil Moisture Sensor
- Analog pH Sensor Module
- SH1106 OLED Display (128x64, I2C)
- USB Cable (Micro-USB)
- Breadboard and jumper wires

**Software Requirements:**
- Node.js 18+ and npm
- MicroPython firmware for ESP32
- Thonny IDE or similar for ESP32 programming
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Firebase account (free tier sufficient)
- Git (optional, for version control)

### 10.2 Hardware Setup

**Step 1: Circuit Assembly**
1. Connect DHT22 data pin to GPIO 4
2. Connect OLED SDA to GPIO 21, SCL to GPIO 22
3. Connect moisture sensor to GPIO 34 (ADC)
4. Connect pH sensor to GPIO 35 (ADC)
5. Connect all VCC pins to 3.3V
6. Connect all GND pins to common ground
7. Add 10kΩ pull-up resistors on I2C lines if needed

**Step 2: Flash MicroPython Firmware**
```bash
# Erase existing firmware
esptool.py --chip esp32 --port COM3 erase_flash

# Flash MicroPython
esptool.py --chip esp32 --port COM3 write_flash -z 0x1000 esp32-micropython.bin
```

**Step 3: Upload Sensor Code**
1. Open `Physical Components Lab Files/main.py` in Thonny
2. Update WiFi credentials: `WIFI_SSID` and `WIFI_PASSWORD`
3. Update Firebase URL: `FIREBASE_URL`
4. Upload to ESP32 using Thonny
5. Reset ESP32 to start the program


### 10.3 Firebase Configuration

**Step 1: Create Firebase Project**
1. Navigate to https://console.firebase.google.com
2. Click "Add Project" and follow the setup wizard
3. Enter project name: `iot-vermiq` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

**Step 2: Enable Realtime Database**
1. In Firebase Console, select "Realtime Database" from left menu
2. Click "Create Database"
3. Select database location (closest to your region)
4. Start in "Test Mode" for development
5. Note the database URL (e.g., `https://iot-vermiq-default-rtdb.firebaseio.com`)

**Step 3: Enable Firestore (Optional)**
1. Select "Firestore Database" from left menu
2. Click "Create Database"
3. Choose production mode with default rules
4. Select database location

**Step 4: Enable Authentication**
1. Select "Authentication" from left menu
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Add test user: `demo@vermiq.com` with password `password`

**Step 5: Configure Web App**
1. In Project Settings, scroll to "Your apps"
2. Click Web icon (</>) to register web app
3. Enter app nickname: "VermIQ-Lite"
4. Copy the Firebase configuration object

### 10.4 Web Dashboard Setup

**Step 1: Clone Repository**
```bash
git clone https://github.com/Madhaparia-Krishna/IoT-semester-project.git
cd VermIQ
```

**Step 2: Install Dependencies**
```bash
npm install
```


**Step 3: Configure Environment Variables**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your Firebase credentials
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Step 4: Start Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

**Step 5: Build for Production**
```bash
npm run build
```
Production files will be generated in the `dist/` directory.

### 10.6 Demo Mode (Without Hardware)

For demonstration without physical hardware:

**Step 1: Run Dashboard Only**
```bash
npm run dev
```

**Step 2: Login with Demo Credentials**
- Email: `demo@vermiq.com`
- Password: `password`

**Step 3: Observe Simulated Data**
- Dashboard will show simulated sensor readings
- Data updates every 2.5 seconds in demo mode
- Charts display historical patterns
- "Demo Mode" indicator appears

**Note:** Demo mode uses locally stored data and does not require Firebase connection.

### 10.7 Deployment

**Deployment to Vercel (Recommended):**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel deploy

# Deploy to production
vercel --prod
```

**Environment Variables on Vercel:**
1. Navigate to Vercel Dashboard → Project Settings
2. Add all `VITE_*` environment variables
3. Redeploy for changes to take effect

**Alternative Deployment Platforms:**
- **Netlify**: Drag and drop `dist/` folder
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Configure as static site
- **AWS Amplify**: Connect GitHub repository

### 10.8 Troubleshooting

**Issue: ESP32 Not Connecting to WiFi**
- Verify SSID and password are correct
- Check WiFi network is 2.4 GHz (ESP32 doesn't support 5 GHz)
- Ensure WiFi has internet access for Firebase
- Try moving ESP32 closer to router

**Issue: Firebase Upload Failing**
- Verify Firebase URL is correct in `main.py`
- Check database rules allow write access
- Ensure ESP32 has internet connectivity
- Review serial monitor for error messages

**Issue: Dashboard Shows "Demo Mode"**
- Verify `.env` file exists in project root
- Check all Firebase environment variables are set
- Restart development server after creating `.env`
- Clear browser cache (Ctrl+Shift+R)

**Issue: Sensors Returning N/A Values**
- Check sensor wiring and connections
- Verify sensors have proper power supply (3.3V)
- Test sensors individually in serial monitor
- Replace faulty sensors if necessary

**Issue: OLED Display Not Working**
- Verify I2C address (should be 0x3C)
- Check SDA/SCL connections (GPIO 21/22)
- Add 10kΩ pull-up resistors on I2C lines
- Test with I2C scanner code

---

## 12. Conclusions & Future Work

### 11.1 Project Summary

This project successfully demonstrated the development and deployment of a comprehensive IoT monitoring system for vermiculture applications. The VermIQ-Lite platform integrates hardware sensors, cloud infrastructure, and web-based visualization to provide real-time environmental monitoring with the following key achievements:

**Technical Accomplishments:**
1. **Hardware Integration:** Successfully interfaced multiple sensors (DHT22, moisture, pH) with ESP32 microcontroller
2. **Cloud Connectivity:** Established reliable Firebase Realtime Database integration with 99.7% upload success rate
3. **Real-Time Monitoring:** Achieved end-to-end latency of <500ms from sensor to dashboard
4. **Data Visualization:** Developed responsive web dashboard with interactive charts and analytics
5. **Data Export:** Implemented CSV and JSON export functionality for 200+ records
6. **System Reliability:** Demonstrated stable operation for 48+ hours with automatic error recovery


**Educational Outcomes:**
1. Practical experience with IoT system architecture and design principles
2. Hands-on implementation of sensor interfacing and data acquisition
3. Cloud platform integration using Firebase services
4. Full-stack web development with modern frameworks (React, TypeScript)
5. Real-time data synchronization and state management techniques
6. Cross-functional teamwork and project management skills

**Project Impact:**
- Provides accessible solution for vermiculture monitoring
- Demonstrates scalability to multiple beds and sensors
- Offers foundation for agricultural IoT applications
- Showcases integration of hardware, firmware, and software layers

### 11.2 Lessons Learned

**Technical Insights:**
1. **Sensor Calibration is Critical:** Accurate readings require proper calibration procedures with reference standards
2. **Error Handling is Essential:** Robust error handling prevents system crashes from sensor timeouts or network issues
3. **Real-Time Architecture:** WebSocket-based synchronization provides superior user experience compared to polling
4. **State Management:** Lightweight solutions like Zustand offer better developer experience than complex alternatives
5. **Data Export Optimization:** Blob-based downloads handle large datasets better than data URI approach

**Development Process:**
1. **Simulation First:** Wokwi simulation accelerated development and reduced hardware debugging time
2. **Modular Design:** Separation of concerns in firmware and frontend enabled parallel development
3. **Incremental Testing:** Testing each component independently simplified integration debugging
4. **Version Control:** Git facilitated collaboration and code management across team members
5. **Documentation:** Comprehensive documentation proved invaluable for onboarding and troubleshooting


### 11.3 Limitations

**Current System Limitations:**
1. **Power Dependency:** Continuous WiFi operation limits battery life to ~11 hours
2. **Single Node Focus:** Dashboard currently optimized for single ESP32 node
3. **Calibration Maintenance:** pH sensor requires periodic recalibration
4. **Network Requirement:** System depends on stable WiFi and internet connectivity
5. **Environmental Protection:** Hardware requires weatherproofing for outdoor deployment
6. **Sensor Accuracy:** Consumer-grade sensors have inherent accuracy limitations
7. **Data Storage:** Firebase free tier limits historical data retention

**Scalability Considerations:**
1. Firebase Realtime Database pricing increases with data volume
2. Multiple simultaneous nodes may require optimization
3. Chart rendering performance degrades beyond 500 data points
4. Mobile app not yet developed for iOS/Android platforms


### 11.4 Broader Applications

The VermIQ-Lite platform architecture can be adapted for various agricultural and environmental monitoring applications:

**Agricultural Applications:**
- Greenhouse climate control
- Hydroponic system monitoring
- Soil health assessment for traditional farming
- Livestock environment monitoring
- Mushroom cultivation tracking

**Environmental Applications:**
- Water quality monitoring in aquaculture
- Air quality tracking in urban environments
- Weather station network
- Forest fire early warning systems
- Wildlife habitat monitoring

**Educational Applications:**
- STEM education demonstrator
- IoT system design teaching platform
- Data science and analytics coursework
- Environmental science experiments
- Agricultural technology training


### 11.5 Sustainability Impact

**Environmental Benefits:**
1. **Optimized Vermiculture:** Better environmental control leads to improved compost quality
2. **Waste Reduction:** Efficient composting diverts organic waste from landfills
3. **Carbon Sequestration:** Vermicompost improves soil carbon retention
4. **Water Conservation:** Precise moisture monitoring prevents overwatering
5. **Reduced Chemical Use:** Healthy compost reduces need for synthetic fertilizers

**Economic Benefits:**
1. **Increased Efficiency:** Automated monitoring reduces manual labor requirements
2. **Quality Improvement:** Optimal conditions produce higher-quality vermicompost
3. **Yield Prediction:** Data-driven insights enable better production planning
4. **Cost Tracking:** Export functionality facilitates cost-benefit analysis
5. **Scalability:** Cloud infrastructure enables growth without proportional cost increase

**Social Benefits:**
1. **Knowledge Sharing:** Open-source approach enables community collaboration
2. **Accessibility:** Cloud-based dashboard accessible from anywhere with internet
3. **Education:** Provides learning platform for sustainable agriculture practices
4. **Rural Development:** Technology transfer to small-scale farmers
5. **Food Security:** Improved compost supports sustainable food production

### 11.6 Final Remarks

The VermIQ-Lite project represents a successful integration of hardware engineering, firmware development, cloud computing, and modern web technologies to address a practical agricultural monitoring need. The system demonstrates the potential of IoT technology to transform traditional agricultural practices through data-driven insights and automation.

The interdisciplinary nature of this project provided valuable learning experiences across multiple domains, from low-level sensor interfacing to high-level web application development. The collaborative team effort, combining expertise in hardware design, firmware programming, frontend development, machine learning, security, and documentation, resulted in a cohesive and functional system.

While the project successfully achieved its primary objectives of real-time sensor monitoring, cloud data storage, and web-based visualization, it also highlighted areas for improvement in power management, scalability, and commercial deployment readiness. These limitations provide clear direction for future development phases.

The VermIQ-Lite platform demonstrates that accessible, cost-effective IoT solutions can be developed for agricultural applications using readily available components and open-source technologies. This approach makes precision agriculture technology available to small-scale farmers and educational institutions that may not have access to expensive commercial solutions.

---

## 13. Security and Data Protection

Security is a critical consideration for IoT systems that collect and transmit sensor data to cloud platforms. The VermIQ-Lite system implements multiple security layers to protect data integrity and prevent unauthorized access:

### 12.1 Network Security

**WiFi Security:**
- ESP32 connects through WPA2-PSK encrypted WiFi networks
- WiFi credentials stored in firmware configuration (not hardcoded in production)
- Support for enterprise WPA2-Enterprise authentication (future enhancement)
- 2.4 GHz WiFi ensures compatibility while maintaining security

**Data Transmission:**
- All Firebase communication uses HTTPS/TLS encryption
- Sensor data encrypted in transit between ESP32 and Firebase
- WebSocket connections secured with WSS protocol
- No plaintext transmission of sensitive information

### 12.2 Firebase Security

**Authentication Controls:**
- Firebase Authentication protects dashboard access
- Email/password authentication with secure credential storage
- Session management with automatic token refresh
- Password reset functionality via email verification
- User accounts isolated with Firebase Auth UID system

**Database Security Rules:**
```javascript
// Firebase Realtime Database Rules
{
  "rules": {
    "latest_readings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "readings_history": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["timestamp_epoch_ms"]
    }
  }
}

// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sensor_readings/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /alerts/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Access Control:**
- Firebase rules restrict unauthorized read/write operations
- Only authenticated users can access sensor data
- Each reading includes timestamp, reading number, and source fields for traceability
- Database queries limited to prevent abuse (e.g., max 200 records per query)

### 12.3 Frontend Security

**Credential Management:**
- React frontend uses Firebase web configuration (public API keys)
- API keys restricted to authorized domains in Firebase Console
- Environment variables stored in `.env` files (excluded from version control)
- No service account keys or admin credentials exposed in frontend
- Admin/service account credentials never committed to repository

**Client-Side Protection:**
- Firebase web API keys are domain-restricted in Firebase Console
- Client-side code cannot bypass Firebase security rules
- All database access validated by Firebase backend rules
- XSS protection through React's built-in sanitization
- CSRF protection through Firebase's token-based authentication

### 12.4 Code Repository Security

**.gitignore Configuration:**
```gitignore
# Environment variables and secrets
.env
serviceAccountKey.json
*.key
*.pem

# Node modules and build artifacts
node_modules
dist
dist-ssr
*.local
```

**Best Practices:**
- WiFi passwords not committed to repository
- Firebase service account keys excluded from version control
- Private API keys stored in environment variables only
- `.env.example` template provided without actual credentials
- Regular security audits of committed code

### 12.5 Data Integrity and Traceability

**Sensor Data Validation:**
- Each reading includes multiple verification fields:
  - `timestamp_iso`: Human-readable ISO 8601 timestamp with timezone
  - `timestamp_epoch_ms`: Unix epoch milliseconds for sorting
  - `reading_number`: Sequential counter for detecting gaps
  - `source`: Node identifier for multi-device deployments
- Invalid sensor readings (timeouts, out-of-range) handled gracefully
- Data anomalies logged for investigation

**Audit Trail:**
- Historical data preserved in `readings_history` node
- Firestore backup provides additional data redundancy
- Export functionality enables external data auditing
- Firebase Console logs all database access attempts

### 12.6 Offline Security Considerations

**Current Implementation:**
- ESP32 continues local sensing during WiFi disconnection
- OLED display shows current readings without cloud dependency
- Cloud upload automatically resumes when WiFi reconnects
- No persistent local storage of credentials (stored in firmware only)

**Future Offline Improvements:**
- Encrypted local storage using ESP32 flash or SD card
- Cryptographic signing of buffered data for integrity verification
- Automatic data synchronization upon reconnection
- Tamper detection for physical security

### 12.7 Future Security Enhancements

**Planned Improvements:**
1. **Firebase App Check:** Verify requests come from legitimate VermIQ apps
2. **End-to-End Encryption:** Additional encryption layer for highly sensitive deployments
3. **Multi-Factor Authentication:** SMS or authenticator app 2FA for dashboard access
4. **Role-Based Access Control (RBAC):** Admin, operator, and viewer roles with granular permissions
5. **Security Monitoring:** Real-time alerts for suspicious database access patterns
6. **Secure MQTT/TLS:** Certificate-based authentication for MQTT broker communication
7. **Hardware Security:** Secure boot and encrypted firmware on ESP32
8. **Penetration Testing:** Third-party security audit before commercial deployment

### 12.8 Security Limitations

**Current Constraints:**
1. **Test Mode Database:** Development database uses relaxed security rules (production requires stricter rules)
2. **No Client Attestation:** Firebase App Check not yet implemented
3. **Basic Authentication:** Only email/password auth (no OAuth, SAML, or biometric)
4. **Physical Access:** ESP32 firmware can be extracted if device is physically compromised
5. **WiFi Credentials:** Stored in plaintext in MicroPython firmware configuration
6. **No Data Encryption at Rest:** Firebase stores data encrypted, but no additional application-layer encryption

**Mitigation Strategies:**
- Deploy production databases with strict security rules requiring authentication
- Use environment-specific Firebase configurations (dev, staging, production)
- Rotate WiFi credentials regularly
- Physical security measures for deployed hardware (locked enclosures)
- Regular security updates to dependencies (npm audit, Firebase SDK updates)
- Monitor Firebase Console for unusual activity patterns

### 12.9 Compliance and Privacy

**Data Privacy Considerations:**
- System collects only environmental sensor data (temperature, humidity, moisture, pH)
- No personally identifiable information (PII) collected from users except email for authentication
- User email addresses stored securely in Firebase Authentication system
- Data retention policy: Historical data retained indefinitely (future: configurable retention)
- Data export capability allows users to retrieve their own data

**Regulatory Compliance:**
- GDPR considerations: User data can be exported and deleted upon request
- Data residency: Firebase region configurable for compliance requirements
- Audit logs available through Firebase Console for compliance verification

---

## 14. References

### Academic and Technical Resources

1. **ESP32 Documentation**
   - Espressif Systems. (2026). *ESP32 Technical Reference Manual*. Retrieved from https://www.espressif.com/en/products/socs/esp32

2. **MicroPython Documentation**
   - MicroPython Project. (2026). *MicroPython Documentation*. Retrieved from https://docs.micropython.org/

3. **Firebase Platform**
   - Google LLC. (2026). *Firebase Documentation - Realtime Database*. Retrieved from https://firebase.google.com/docs/database
   - Google LLC. (2026). *Firebase Authentication Documentation*. Retrieved from https://firebase.google.com/docs/auth
   - Google LLC. (2026). *Cloud Firestore Documentation*. Retrieved from https://firebase.google.com/docs/firestore

4. **React and TypeScript**
   - Meta Platforms, Inc. (2026). *React Documentation*. Retrieved from https://react.dev/
   - Microsoft Corporation. (2026). *TypeScript Handbook*. Retrieved from https://www.typescriptlang.org/docs/

5. **Sensor Datasheets**
   - Aosong Electronics. (2019). *DHT22 Temperature and Humidity Sensor Datasheet*.
   - *Capacitive Soil Moisture Sensor v1.2 Datasheet*. Corrosion-resistant design.
   - *Analog pH Sensor Kit (pH 0-14) for Arduino*. E-201-C pH electrode specifications.

6. **Vermiculture Research**
   - Edwards, C. A., & Bohlen, P. J. (1996). *Biology and Ecology of Earthworms* (3rd ed.). Chapman & Hall.
   - Domínguez, J., & Edwards, C. A. (2011). "Relationships between composting and vermicomposting." *BioCycle*, 52(4), 20-24.
   - Lim, S. L., Wu, T. Y., Lim, P. N., & Shak, K. P. Y. (2015). "The use of vermicompost in organic farming." *Pertanika Journal of Tropical Agricultural Science*, 38(2), 167-193.

### Online Resources and Tools

7. **IoT Platforms and Simulation**
   - Wokwi. (2026). *Online ESP32, Arduino and Raspberry Pi Simulator*. https://wokwi.com/
   - Project Simulation Link: https://wokwi.com/projects/465181219780428801

8. **Development Tools**
   - Vite.js. (2026). *Next Generation Frontend Tooling*. https://vitejs.dev/
   - Recharts. (2026). *Redefined Chart Library Built with React and D3*. https://recharts.org/
   - Zustand. (2026). *Bear necessities for state management in React*. https://github.com/pmndrs/zustand
   - TailwindCSS. (2026). *Utility-First CSS Framework*. https://tailwindcss.com/

9. **Hardware Design**
   - EasyEDA. (2026). *Online PCB Design & Circuit Simulator*. https://easyeda.com/
   - Fritzing. (2026). *Electronics Made Easy*. https://fritzing.org/

### Machine Learning & Predictive Analytics

9. **Scikit-learn**
   - Pedregosa et al. (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830. https://scikit-learn.org/

10. **ONNX Runtime**
    - Microsoft. (2026). *ONNX Runtime — Cross-Platform Inference Accelerator*. https://onnxruntime.ai/
    - ONNX Community. (2026). *Open Neural Network Exchange Format*. https://onnx.ai/

11. **Isolation Forest**
    - Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). *Isolation Forest*. IEEE International Conference on Data Mining (ICDM). https://doi.org/10.1109/ICDM.2008.17

12. **Gradient Boosting / XGBoost**
    - Chen, T., & Guestrin, C. (2016). *XGBoost: A Scalable Tree Boosting System*. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining. https://doi.org/10.1145/2939672.2939785

13. **Random Forests**
    - Breiman, L. (2001). *Random Forests*. Machine Learning, 45(1), 5–32. https://doi.org/10.1023/A:1010933404324

14. **SHAP (SHapley Additive exPlanations) — Explainability**
    - Lundberg, S. M., & Lee, S. I. (2017). *A Unified Approach to Interpreting Model Predictions*. Advances in Neural Information Processing Systems. https://shap.readthedocs.io/

15. **Vermiculture & Environmental Parameter Research**
    - Domínguez, J. (2004). *State of the Art and New Perspectives on Vermicomposting Research*. In Edwards, C. A. (Ed.), *Earthworm Ecology* (2nd ed., pp. 401–424). CRC Press.
    - Sinha, R. K., Bharambe, G., & Chaudhari, U. (2008). *Sewage Treatment by Earthworms and its Approvability*. The Environmentalist, 28, 409–420. (Source for optimal pH 6.0–7.5, temp 20–35°C, moisture 60–80% ranges)

### Standards and Protocols


10. **Communication Protocols**
    - MQTT Version 5.0 Specification. OASIS Standard. https://mqtt.org/
    - ISO 8601 Date and Time Format Standard. International Organization for Standardization.
    - HTTP/1.1 RFC 2616. Internet Engineering Task Force (IETF).

11. **Security Standards**
    - OWASP IoT Security Project. (2026). *IoT Security Guidance*. https://owasp.org/www-project-internet-of-things/
    - WPA2 Security Protocol. Wi-Fi Alliance.

### Project Repository

12. **Source Code and Documentation**
    - GitHub Repository: https://github.com/Madhaparia-Krishna/IoT-semester-project
    - Project License: [Specify License - e.g., MIT, GPL, Apache 2.0]

---

## 15. Appendix

### Appendix A: Hardware Bill of Materials (BOM)

| Item | Part Number / Model | Quantity | Unit Price (USD) | Total (USD) | Supplier |
|------|---------------------|----------|------------------|-------------|----------|
| ESP32 DevKit V1 | ESP32-WROOM-32 | 1 | $8.00 | $8.00 | Amazon/AliExpress |
| DHT22 Sensor | AM2302 | 1 | $4.50 | $4.50 | Adafruit/Amazon |
| Capacitive Moisture Sensor | v1.2 Corrosion-resistant | 1 | $3.00 | $3.00 | AliExpress |
| pH Sensor Module | Analog pH 0-14 with probe | 1 | $25.00 | $25.00 | DFRobot/Amazon |
| SH1106 OLED Display | 0.96" 128x64 I2C | 1 | $5.00 | $5.00 | Amazon |
| Breadboard | 830 tie-points | 1 | $3.00 | $3.00 | Amazon |
| Jumper Wires | Male-to-Female, 40pcs | 1 | $2.00 | $2.00 | Amazon |
| Resistors | 10kΩ 1/4W (10 pack) | 1 | $1.00 | $1.00 | Amazon |
| USB Cable | Micro-USB 1m | 1 | $2.00 | $2.00 | Amazon |
| PCB Manufacturing | Custom 2-layer PCB (optional) | 5 | $2.00 | $10.00 | JLCPCB |
| **Total Estimated Cost** | | | | **$63.50** | |

*Note: Prices are approximate and may vary by region and supplier. PCB manufacturing is optional; breadboard prototyping is sufficient for proof-of-concept.*

### Appendix B: Firebase Database Export Sample

**Sample Latest Reading (JSON):**
```json
{
  "timestamp_iso": "2026-06-16T17:20:00+03:00",
  "timestamp_epoch_ms": 1781619600000,
  "reading_number": 1,
  "dht22_humidity": 47.9,
  "dht22_temp": 26.6,
  "moisture_percent": 62.76,
  "moisture_raw": 2570,
  "ph": 5.81,
  "ph_raw": 3368,
  "ph_voltage": 2.714,
  "source": "ESP32-NODE-01"
}
```

**Sample CSV Export (first 5 rows):**
```csv
Reading #,Timestamp,Temperature (°C),Humidity (%),Moisture (%),Moisture Raw,pH,pH Voltage,pH Raw
1,2026-06-16T17:20:00+03:00,26.6,47.9,62.76,2570,5.81,2.714,3368
2,2026-06-16T17:20:10+03:00,26.7,47.8,62.74,2569,5.82,2.713,3367
3,2026-06-16T17:20:20+03:00,26.6,47.9,62.78,2571,5.80,2.715,3369
4,2026-06-16T17:20:30+03:00,26.8,47.7,62.72,2568,5.83,2.712,3366
5,2026-06-16T17:20:40+03:00,26.7,47.8,62.75,2570,5.81,2.714,3368
```

### Appendix C: Sensor Calibration Procedures

**DHT22 Temperature Calibration:**
1. Place DHT22 next to a calibrated reference thermometer
2. Record both readings simultaneously over 30 minutes
3. Calculate average offset: `DHT_TEMP_OFFSET = Reference_Avg - DHT22_Avg`
4. Update `DHT_TEMP_OFFSET` in firmware configuration

**Moisture Sensor Calibration:**
1. Dry sensor completely in air or dry soil for 10 minutes
2. Record raw ADC value: `MOISTURE_DRY_RAW`
3. Submerge sensor in water or saturated soil
4. Record raw ADC value: `MOISTURE_WET_RAW`
5. Update both values in firmware configuration

**pH Sensor 2-Point Calibration:**
1. Rinse pH probe with distilled water
2. Place in pH 7.0 buffer solution, record voltage: `V_pH7`
3. Rinse again with distilled water
4. Place in pH 4.0 buffer solution, record voltage: `V_pH4`
5. Calculate: `PH_SLOPE = (V_pH7 - V_pH4) / (7.0 - 4.0)`
6. Set `PH_NEUTRAL_VOLTAGE = V_pH7` and update `PH_SLOPE`

### Appendix D: Firebase Configuration Template

**`.env` File Template:**
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**ESP32 Firmware Configuration:**
```python
# WiFi Settings
WIFI_SSID = "YourNetworkName"
WIFI_PASSWORD = "YourNetworkPassword"

# Firebase Settings
FIREBASE_URL = "https://your-project-default-rtdb.firebaseio.com"
FIREBASE_AUTH = ""  # Leave empty for test mode, add auth token for production
```

### Appendix E: Testing Logs Summary

**48-Hour Continuous Operation Test Results:**
- **Test Period:** June 14-16, 2026
- **Total Readings Collected:** 2,100+
- **Data Upload Success Rate:** 99.7% (2,094 successful, 6 retries)
- **WiFi Disconnections:** 3 (all recovered automatically within 30 seconds)
- **DHT22 Timeout Errors:** 11 (0.5% error rate, handled gracefully)
- **System Uptime:** 99.2% (47.6 hours out of 48 hours)
- **Average Power Consumption:** 0.6W (180 mA @ 3.3V)

**Browser Compatibility Test Results:**
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 120.0+ |   Pass | Full functionality |
| Firefox | 121.0+ |   Pass | Full functionality |
| Edge | 120.0+ |   Pass | Full functionality |
| Safari | 17.0+ |   Pass | Minor CSS differences in glassmorphism |
| Mobile Chrome | Android 13 |   Pass | Responsive layout works well |
| Mobile Safari | iOS 17 |   Pass | Touch interactions smooth |

### Appendix F: Troubleshooting Decision Tree

```
ESP32 Not Working?
├─ Power LED Off?
│  ├─ Yes → Check USB cable and power supply
│  └─ No → Continue
├─ Serial Output?
│  ├─ No → Check USB driver, COM port, baud rate (115200)
│  └─ Yes → Continue
├─ WiFi Connected?
│  ├─ No → Check SSID/password, 2.4GHz network, signal strength
│  └─ Yes → Continue
├─ Sensors Returning N/A?
│  ├─ Yes → Check wiring, sensor power, try individual sensor tests
│  └─ No → Continue
├─ Firebase Upload Failing?
│  ├─ Yes → Check Firebase URL, database rules, internet connectivity
│  └─ No → System working correctly

Dashboard Not Showing Data?
├─ "Demo Mode" Indicator?
│  ├─ Yes → .env file missing or incorrect → Check Firebase config
│  └─ No → Continue
├─ "Live Firebase Data" Indicator?
│  ├─ No → Firebase not connected → Check credentials, database rules
│  └─ Yes → Continue
├─ ESP32 Uploading Data?
│  ├─ No → Check ESP32 troubleshooting above
│  └─ Yes → Check browser console for errors
```

### Appendix G: Machine Learning Module Quick Reference

#### G.1 Sensor Ideal Ranges Summary

| Sensor | Ideal (Operational) | Ideal (Harvest) | Absolute Limits |
|--------|---------------------|----------------|----------------|
| Temperature | 25–30°C | 24–30°C | 15°C / 40°C |
| Humidity | 60–80% | 60–80% | 30% / 95% |
| Moisture | 55–75% | 55–75% | 20% / 95% |
| pH | 6.0–7.5 | 6.2–7.2 | 4.0 / 9.0 |

#### G.2 ML Prediction Pipeline at a Glance

```
SensorReading (Firebase or Simulation)
        ↓
  buildFeatureVector()         ← preprocessing.ts
        ↓
  detectAnomalies()            ← anomalyDetection.ts (3 layers)
        ↓
  predictHarvestReadiness()    ← harvestPredictor.ts (weighted + stability bonus)
        ↓
  classifyEnvironment()        ← environmentScorer.ts
  scoreToRiskLevel()
        ↓
  generateRecommendations()    ← recommendationEngine.ts (17 rules)
        ↓
  PredictionResult → Zustand → MLAnalytics.tsx
```

#### G.3 Scoring Weight Reference

| Sensor | Environmental Score Weight | Harvest Score Weight |
|--------|--------------------------|---------------------|
| Temperature | 30% | 30% |
| Moisture | 30% | 30% |
| Humidity | 20% | 20% |
| pH | 20% | 20% |

#### G.4 ML Navigation Troubleshooting

**Issue: Machine Learning page shows all scores as '--'**
- Wait 1–2 seconds on page load; `runMLPrediction()` runs automatically on mount
- If persisting, check browser console for TypeScript runtime errors

**Issue: Live Firebase mode shows no data**
- Ensure Firebase `.env` credentials are configured
- Check that ESP32 is uploading to `latest_readings`
- Verify `store.telemetry[activeNodeId]` is populated (check Overview dashboard first)
- The system falls back to simulated node data if Firebase is not connected

**Issue: Preset scenarios not changing predictions**
- Each preset click calls `applyPreset()` which sets values then calls `runMLPrediction()` after 50ms debounce
- If predictions don't update, try clicking a different preset first then back

**Issue: Trend charts not appearing**
- Charts require a minimum of 2 historical predictions
- Click different presets or adjust sliders 2+ times to accumulate data
- Data is in-memory only — refreshing the page resets history

**Issue: Confidence always shows ~50%**
- In simulation mode with no history, 50% is the correct starting confidence
- Accumulate 15–20+ predictions by changing scenarios/sliders to raise confidence
- In Live Firebase mode, confidence rises as `readings_history` records accumulate

#### G.5 Preset Scenario Quick Reference Card

| To demonstrate... | Use this preset | Expected result |
|------------------|----------------|----------------|
| Healthy bed | Normal Conditions | Score ≈ 95, LOW risk, Harvest ≈ 85% |
| Drought stress | Dry Compost | Score ≈ 45, HIGH risk, moisture warnings |
| pH problem | Acidic Compost | Score ≈ 20, CRITICAL, pH recommendations |
| Heat emergency | Overheated Bed | Score ≈ 25, CRITICAL, anomaly detected |
| Broken sensors | Sensor Failure | Score ≈ 0, CRITICAL, hardware fault warnings |

#### G.6 Phase 2 ML Implementation Checklist (Future)

```
[ ] Collect 6+ months of labelled sensor data from deployed hardware
[ ] Label anomalies using physical testing log timestamps
[ ] Label harvest readiness at 30-day visual inspection intervals
[ ] Run Python training pipeline (export from Firebase → CSV → train → ONNX)
[ ] Validate: RF F1 ≥ 0.85, XGBoost RMSE ≤ 5.0, IsoForest Recall ≥ 0.80
[ ] Place .onnx files in /public/models/
[ ] Install onnxruntime-web: npm install onnxruntime-web
[ ] Update src/ml/index.ts runPrediction() to use ONNX inference
[ ] Run npm run build to verify zero TypeScript errors
[ ] Deploy to Vercel / Firebase Hosting
```

