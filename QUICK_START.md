# VermIQ-Lite Quick Start Guide ⚡

Get up and running with VermIQ-Lite in under 5 minutes!

---

## 🚀 Instant Demo (No Setup Required)

### Option 1: Run Locally

```bash
# Navigate to project directory
cd VermIQ

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:5173`

**Demo Credentials**:
- Email: `demo@vermiq.com`
- Password: `password`

### Option 2: Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Visit: `http://localhost:4173`

---

## 🎮 Using Demo Mode

Demo mode provides a **fully functional** platform with simulated sensor data.

### Features Available

✅ Real-time telemetry updates (every 2.5 seconds)
✅ 4 simulated ESP32 nodes with different states
✅ Automatic alert generation
✅ All dashboard pages and visualizations
✅ Settings persistence (localStorage)
✅ No Firebase or hardware required

### Simulated Nodes

1. **ESP32-NODE-01** (Healthy)
   - Moisture: ~72% (optimal)
   - Temperature: ~21°C (stable)
   - Status: Near harvest (48/60 days)

2. **ESP32-NODE-02** (Warning)
   - Moisture: ~52% (below threshold)
   - Temperature: ~26°C (slightly high)
   - Status: Dry warning

3. **ESP32-NODE-03** (Critical)
   - Moisture: ~34% (critically low)
   - Temperature: ~32°C (too hot)
   - Status: Critical alert

4. **ESP32-NODE-04** (Offline)
   - All sensors: Offline
   - Status: Connection lost

---

## 📱 Dashboard Navigation

### Main Pages

1. **Dashboard** (Overview)
   - Real-time metrics cards
   - Harvest progress tracker
   - Node status panel
   - Quick navigation links

2. **Beds**
   - Individual bed monitoring
   - Environmental status
   - Harvest readiness indicators

3. **Analytics**
   - Moisture trend graph
   - Temperature trend graph
   - Multi-sensor comparison
   - Node comparison bar chart
   - Moisture heatmap (3x3 grid)
   - Environmental stability score

4. **Alerts**
   - Active alerts list
   - Alert history
   - Acknowledge/clear actions
   - Severity filtering

5. **Nodes**
   - ESP32 device registry
   - Online/offline status
   - Signal strength (RSSI)
   - Battery voltage

6. **Historical Data**
   - Time-range filtering (1h, 6h, 24h)
   - Trend analysis
   - Export-ready data

7. **Settings**
   - Threshold configuration
   - Firebase setup (optional)
   - ThingSpeak integration
   - Profile management

---

## ⚙️ Quick Configuration

### Adjust Alert Thresholds

1. Navigate to **Settings**
2. Scroll to **Threshold Configuration**
3. Adjust values:
   - Moisture Min: 60% (default)
   - Moisture Max: 80% (default)
   - Temperature Min: 18°C (default)
   - Temperature Max: 25°C (default)
4. Click **Save Settings**

Alerts will trigger automatically when thresholds are exceeded.

### Switch Between Nodes

**Method 1**: Use dropdown in Overview page
**Method 2**: Click bed cards in Beds page
**Method 3**: Select from Nodes registry

---

## 🔥 Firebase Setup (Optional)

To connect real Firebase backend:

### Step 1: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Services

**Authentication**:
1. Navigate to Authentication → Sign-in method
2. Enable Email/Password
3. Save

**Firestore**:
1. Navigate to Firestore Database
2. Click Create database
3. Choose Production mode
4. Select region
5. Enable

### Step 3: Get Config

1. Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app
5. Copy firebaseConfig object

### Step 4: Configure VermIQ

**Option A: Environment Variables**

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Option B: In-App Configuration**

1. Navigate to **Settings** → **Firebase Configuration**
2. Paste your Firebase config JSON
3. Click **Save & Connect**
4. Restart application

### Step 5: Create Account

1. Logout from demo account
2. Click "Sign Up"
3. Enter email and password
4. Create account

Your data will now sync to Firebase!

---

## 🔌 ESP32 Hardware Setup (Optional)

To connect real ESP32 sensors:

### Quick Hardware Checklist

- [ ] ESP32-WROOM-32 board
- [ ] Capacitive soil moisture sensor
- [ ] DHT22 temperature/humidity sensor
- [ ] 3.7V Li-ion battery
- [ ] Jumper wires

### Quick Wiring

```
ESP32 Pin → Sensor
-----------------
3.3V      → Sensors VCC
GND       → Sensors GND
GPIO 15   → DHT22 Data (+ 10kΩ pull-up)
GPIO 34   → Moisture Analog Out
```

### Arduino Code

See [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md) for complete code and instructions.

### MQTT Configuration

Update Arduino code:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";
const char* device_id = "ESP32-NODE-01";
```

Upload code and monitor Serial output for connection status.

---

## 🎯 Common Tasks

### View Real-Time Data

1. Login to dashboard
2. Select node from dropdown
3. Watch metrics update every 2.5 seconds

### Check Alerts

1. Click bell icon in top bar
2. View active alerts dropdown
3. Or navigate to Alerts page for full history

### Analyze Trends

1. Navigate to Analytics page
2. Select time range (1h, 6h, 24h)
3. View charts and heatmaps

### Export Data

1. Navigate to Historical Data page
2. Select time range
3. Copy data from charts (future: CSV export)

### Acknowledge Alerts

1. Navigate to Alerts page
2. Click "Acknowledge" on alert card
3. Alert moves to history

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Firebase Connection Issues

1. Verify environment variables are set
2. Check Firebase project settings
3. Ensure Authentication is enabled
4. Review browser console for errors

### Demo Mode Not Working

1. Clear browser cache and localStorage
2. Refresh page
3. Try incognito/private window

---

## 📚 Next Steps

### Learn More

- Read [README.md](README.md) for complete documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md) for hardware setup

### Deploy to Production

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Customize

- Modify thresholds in Settings
- Adjust colors in `src/index.css`
- Add custom sensors in `src/services/simulator.ts`
- Extend dashboard in `src/components/dashboard/`

---

## 💡 Tips & Tricks

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search (future feature)
- `Esc` - Close modals and dropdowns

### Performance

- Use Chrome DevTools for performance profiling
- Enable React DevTools for component inspection
- Monitor Network tab for Firebase calls

### Development

- Hot Module Replacement (HMR) enabled
- TypeScript errors show in terminal
- ESLint warnings in editor

---

## 🎉 You're Ready!

VermIQ-Lite is now running. Explore the dashboard, check out the analytics, and see how the alert system works.

**Need help?** Check the documentation or open an issue on GitHub.

---

**Happy Monitoring! 🌱**

VermIQ-Lite - Smart Vermiculture Monitoring Platform
