# Firebase Realtime Database Integration

## Overview
The VermIQ website has been updated to fetch sensor data from Firebase Realtime Database in real-time. The system automatically switches between real-time data and simulated data based on Firebase configuration.

## Changes Made

### 1. Environment Configuration
- Added `VITE_FIREBASE_DATABASE_URL` to `.env` and `.env.example`
- Database URL: `https://iot-vermiq-default-rtdb.firebaseio.com`

### 2. Firebase Service (`src/services/firebase.ts`)
- Imported Firebase Realtime Database SDK
- Added `realtimeDbInstance` to store database connection
- Updated `FirebaseConfigSchema` to include optional `databaseURL`
- Created `realtimeTelemetryService` with:
  - `subscribeToLatestReadings()`: Subscribes to real-time updates from `latest_readings` path
  - `isRealtimeDbAvailable()`: Checks if Realtime Database is configured

### 3. Store Updates (`src/store/useStore.ts`)
- Added `realtimeDataMode` flag to track data source
- Imported `realtimeTelemetryService` from Firebase
- Added `startRealtimeTelemetry()` action that:
  - Subscribes to Firebase Realtime Database updates
  - Maps Firebase data format to internal telemetry format
  - Updates telemetry state with real-time data
  - Returns unsubscribe function for cleanup
- Extended `TelemetryReading` interface to include optional `ph` field

### 4. App Initialization (`src/App.tsx`)
- Added `useEffect` hook to start real-time telemetry when user authenticates
- Automatically cleans up subscription when user logs out

### 5. Dashboard Layout (`src/components/dashboard/DashboardLayout.tsx`)
- Updated simulator to only run when `realtimeDataMode` is false
- Modified connection indicator to show three states:
  - **Real-Time Data** (green): Active Firebase Realtime Database connection
  - **Firebase Connected** (cyan): Firebase configured but not receiving real-time data
  - **Demo Mode Sim** (gray): Using simulated data

### 6. Overview Component (`src/components/dashboard/Overview.tsx`)
- Changed metric cards grid from 3 columns to 4 columns to accommodate pH sensor
- Added pH Level card that displays when real-time data includes pH readings
- pH card shows optimal range indicator (6.0-7.5)

## Data Mapping

Firebase Realtime Database format → VermIQ telemetry format:

```javascript
{
  dht22_humidity: number    → humidity: number
  dht22_temp: number        → temperature: number
  moisture_percent: number  → moisture: number
  ph: number                → ph: number (new field)
  moisture_raw: number      (stored but not displayed)
  ph_raw: number            (stored but not displayed)
  ph_voltage: number        (stored but not displayed)
}
```

## How It Works

1. **User logs in** → App.tsx triggers `startRealtimeTelemetry()`
2. **Check Firebase** → Service checks if Realtime Database is available
3. **Subscribe** → If available, subscribes to `latest_readings` path
4. **Real-time updates** → Every time ESP32 updates data, website receives it immediately
5. **Data transformation** → Firebase data is mapped to internal format
6. **UI update** → Store updates trigger React re-renders, showing new values
7. **Simulator disabled** → DashboardLayout detects real-time mode and stops simulator

## Visual Indicators

- **Top-right header**: Shows data source status
  - Spinning icon with "Real-Time Data" = Active connection
  - Alert icon with "Firebase Connected" = Connected but no real-time data yet
  - Slow spinning with "Demo Mode Sim" = Using simulated data

- **pH Card**: Only appears when real-time data includes pH readings

## Testing

To test the real-time integration:

1. Ensure Firebase configuration in `.env` includes `VITE_FIREBASE_DATABASE_URL`
2. Log in to the application
3. Check the top-right indicator - should show "Real-Time Data" if connected
4. Update sensor values in Firebase Realtime Database
5. Watch the dashboard update automatically without refresh

## Fallback Behavior

If Firebase Realtime Database is not configured or unavailable:
- System automatically falls back to simulated data
- No errors or disruption to user experience
- Header indicator shows "Demo Mode Sim"

## Future Enhancements

Consider adding to Firebase for complete integration:
- `rssi`: Wi-Fi signal strength from ESP32
- `battery`: Battery voltage from ESP32
- `daysElapsed`: Days since bed started (or calculate from start_date)
- Multiple nodes support (currently maps to first node)

## Security Notes

- Firebase Realtime Database rules should be configured to allow authenticated reads
- Write access should be restricted to ESP32 service account or admin users only
- Current implementation only reads data, doesn't write from web interface
