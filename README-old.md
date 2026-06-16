# VermIQ-Lite 🌱

**Smart Vermiculture Monitoring & Edge Intelligence System**

A premium, production-ready IoT dashboard platform for real-time vermiculture monitoring using ESP32 sensors, MQTT communication, and Firebase cloud integration.

![VermIQ-Lite](https://img.shields.io/badge/VermIQ-Lite-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.13-ffca28?style=for-the-badge&logo=firebase)

---

## 🎯 Overview

VermIQ-Lite is an enterprise-grade IoT monitoring platform designed for precision vermiculture management. It provides real-time analytics, intelligent alerts, and comprehensive environmental tracking for compost bed optimization.

### Key Features

- **🔴 Real-Time Telemetry** - Live sensor data from ESP32 nodes via MQTT
- **📊 Advanced Analytics** - Interactive charts with Recharts (Area, Line, Bar, Heatmaps)
- **🔔 Smart Alerts** - Automated threshold monitoring with instant notifications
- **🌐 Cloud Integration** - Firebase Firestore & ThingSpeak support
- **🔐 Secure Authentication** - Firebase Auth with role-based access
- **📱 Fully Responsive** - Premium UI optimized for desktop, tablet, and mobile
- **🎨 Glassmorphism Design** - Modern dark-mode interface with smooth animations
- **📈 Multi-Node Support** - Monitor multiple vermiculture beds simultaneously

---

## 🏗️ System Architecture

```
┌─────────────┐      MQTT       ┌──────────────┐    WebSocket    ┌─────────────────┐
│  ESP32 IoT  │ ──────────────> │   Firebase   │ ──────────────> │  VermIQ-Lite    │
│   Sensors   │                 │   Firestore  │                 │   Dashboard     │
└─────────────┘                 └──────────────┘                 └─────────────────┘
     │                                 │                                  │
     │                                 │                                  │
  Moisture                         Cloud DB                         React + TS
  Temperature                      Auth Layer                       Recharts
  Humidity                         Real-time Sync                   Zustand
```

### Data Flow

1. **ESP32 Sensors** measure soil moisture, temperature, and humidity
2. **MQTT Protocol** transmits telemetry to cloud broker
3. **Firebase Firestore** stores and syncs data in real-time
4. **VermIQ Dashboard** visualizes data with premium charts and alerts
5. **Alert System** triggers notifications when thresholds are exceeded

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (optional - demo mode available)
- ESP32 hardware with sensors (optional - simulator included)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd VermIQ

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Demo Mode

VermIQ-Lite includes a **full-featured demo mode** with:
- Simulated ESP32 sensor data
- Mock authentication (demo@vermiq.com / password)
- Local storage for alerts and settings
- No Firebase configuration required

---

## 🔧 Configuration

### Firebase Setup (Optional)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config

#### Option 1: Environment Variables

Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Option 2: In-App Configuration

Navigate to **Settings** → **Firebase Configuration** in the dashboard and enter your credentials.

### ThingSpeak Integration

Configure ThingSpeak in **Settings** → **ThingSpeak Integration**:
- Channel ID
- Read API Key

---

## 📱 Features Deep Dive

### Dashboard Overview

The main dashboard provides:
- **Real-time Metric Cards** - Moisture, Temperature, Humidity
- **Harvest Progress Tracker** - Days elapsed and maturity percentage
- **Node Status Panel** - MQTT, Wi-Fi RSSI, Battery voltage
- **Quick Navigation** - Jump to Analytics, Alerts, or Beds

### Analytics Section

Advanced visualizations include:
- **Moisture Trend Graph** - Area chart with gradient fill
- **Temperature Trend** - Real-time line chart
- **Multi-Sensor Comparison** - Synchronized parameter overlay
- **Node Comparison** - Bar chart across all beds
- **Moisture Heatmap** - 3x3 probe grid visualization
- **Environmental Stability Score** - Circular gauge indicator

### Alert System

Intelligent monitoring with:
- **Threshold Detection** - Moisture, temperature, humidity limits
- **Severity Levels** - Critical, Warning, Info, Success
- **Real-time Notifications** - Toast messages and notification center
- **Alert History** - Persistent log with acknowledgment
- **Firebase Sync** - Cloud-backed alert storage

### Beds Management

Monitor multiple vermiculture beds:
- Individual bed telemetry cards
- Harvest readiness indicators
- Environmental status badges
- Quick bed switching

### Nodes Management

ESP32 device registry:
- Online/offline status
- Signal strength (RSSI)
- Battery voltage monitoring
- Last sync timestamps
- Bed assignments

### Historical Data

Time-series analysis:
- Configurable time ranges (1h, 6h, 24h)
- Export-ready data structure
- Trend analysis
- Cycle tracking

### Settings Panel

Comprehensive configuration:
- **Threshold Settings** - Moisture, temperature, humidity limits
- **Firebase Configuration** - Cloud connection management
- **ThingSpeak Integration** - Secondary data source
- **Profile Management** - User account settings
- **Theme Preferences** - Dark mode (default)

---

## 🎨 Design System

### Color Palette

- **Primary**: Emerald (#10b981) - Growth, health, success
- **Secondary**: Cyan (#06b6d4) - Technology, data, sensors
- **Accent**: Amber (#f59e0b) - Temperature, warnings
- **Critical**: Rose (#f43f5e) - Alerts, errors
- **Background**: Deep Space (#06070a) - Premium dark mode

### Typography

- **Display Font**: Outfit - Headers, metrics, branding
- **Body Font**: Plus Jakarta Sans - Content, UI elements

### Components

- **GlassCard** - Glassmorphism container with blur effects
- **StatusBadge** - Real-time status indicators
- **ToastContainer** - Notification system
- **Logo** - Multi-variant branding (full, icon, minimal)

---

## 🛠️ Tech Stack

### Frontend

- **React 19.2** - UI framework
- **TypeScript 6.0** - Type safety
- **Vite 5.4** - Build tool and dev server
- **TailwindCSS 4.3** - Utility-first styling
- **Framer Motion 12.40** - Smooth animations

### State Management

- **Zustand 5.0** - Lightweight state management
- Real-time telemetry updates
- Alert and notification handling
- Settings persistence

### Data Visualization

- **Recharts 3.8** - Chart library
- Area charts with gradients
- Line charts with tooltips
- Bar charts for comparisons
- Custom circular gauges

### Backend & Cloud

- **Firebase 12.13**
  - Authentication (Email/Password)
  - Firestore (Real-time database)
  - Cloud Functions ready
- **MQTT** - IoT message protocol
- **ThingSpeak** - Secondary analytics

### Icons & Assets

- **Lucide React 1.16** - Modern icon library
- Custom SVG logo system
- Optimized image assets

---

## 📂 Project Structure

```
VermIQ/
├── public/
│   ├── favicon.svg          # App icon
│   └── icons.svg            # Icon sprite sheet
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthManager.tsx       # Login/Signup flows
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx   # Main layout
│   │   │   ├── Overview.tsx          # Dashboard home
│   │   │   ├── Analytics.tsx         # Charts & graphs
│   │   │   ├── Alerts.tsx            # Alert center
│   │   │   ├── Beds.tsx              # Bed management
│   │   │   ├── Nodes.tsx             # Device registry
│   │   │   ├── History.tsx           # Historical data
│   │   │   └── Settings.tsx          # Configuration
│   │   ├── landing/
│   │   │   └── LandingPage.tsx       # Marketing page
│   │   ├── logo/
│   │   │   └── Logo.tsx              # Brand component
│   │   └── ui/
│   │       ├── GlassCard.tsx         # Card component
│   │       ├── StatusBadge.tsx       # Status indicator
│   │       └── ToastContainer.tsx    # Notifications
│   ├── services/
│   │   ├── firebase.ts               # Firebase SDK wrapper
│   │   └── simulator.ts              # Demo data generator
│   ├── store/
│   │   └── useStore.ts               # Zustand state
│   ├── App.tsx                       # Root component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite config
└── README.md                         # This file
```

---

## 🔐 Security

### Authentication

- Firebase Authentication with email/password
- Session persistence with secure tokens
- Protected routes with auth guards
- Role-based access architecture (admin/operator)

### Data Protection

- Environment variables for sensitive config
- Firestore security rules ready
- Firebase App Check compatible
- Secure MQTT connections (TLS)

### Best Practices

- No hardcoded credentials
- Least privilege principle
- Input validation
- XSS protection
- CSRF tokens ready

---

## 📊 Sensor Specifications

### Supported Parameters

| Parameter | Range | Optimal | Alert Threshold |
|-----------|-------|---------|-----------------|
| Soil Moisture | 0-100% | 60-80% | <60% or >80% |
| Temperature | 0-50°C | 18-25°C | <18°C or >25°C |
| Humidity | 0-100% | 70-90% | <70% or >90% |
| Days Elapsed | 0-90 days | 60 days | N/A |

### ESP32 Hardware

- **Microcontroller**: ESP32-WROOM-32
- **Moisture Sensor**: Capacitive soil sensor
- **Temperature**: DHT22 or DS18B20
- **Humidity**: DHT22
- **Communication**: MQTT over Wi-Fi
- **Power**: 3.7V Li-ion battery with solar charging

---

## 🧪 Testing

### Demo Credentials

```
Email: demo@vermiq.com
Password: password
```

### Simulated Nodes

- **ESP32-NODE-01**: Healthy bed, near harvest
- **ESP32-NODE-02**: Dry warning state
- **ESP32-NODE-03**: Critical state (low moisture, high temp)
- **ESP32-NODE-04**: Offline node

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Deployment Platforms

- **Vercel** - Recommended (zero-config)
- **Netlify** - Easy setup
- **Firebase Hosting** - Integrated with backend
- **AWS Amplify** - Enterprise scale
- **Docker** - Containerized deployment

### Environment Variables

Ensure all `VITE_*` variables are set in your deployment platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **React Team** - UI framework
- **Firebase** - Cloud infrastructure
- **Recharts** - Data visualization
- **Tailwind Labs** - CSS framework
- **Lucide** - Icon library
- **Vercel** - Deployment platform

---

## 📞 Support

For issues, questions, or feature requests:

- Open an issue on GitHub
- Email: support@vermiq.com
- Documentation: [docs.vermiq.com](https://docs.vermiq.com)

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Real-time telemetry dashboard
- ✅ Firebase integration
- ✅ Alert system
- ✅ Multi-node support

### Phase 2 (Planned)
- 🔄 Machine learning predictions (harvest timing)
- 🔄 Mobile app (React Native)
- 🔄 Email/SMS notifications
- 🔄 Advanced user roles (admin panel)

### Phase 3 (Future)
- 📋 Automated irrigation control
- 📋 Weather API integration
- 📋 Export reports (PDF/CSV)
- 📋 Multi-language support

---

**Built with ❤️ for sustainable agriculture and smart farming**

VermIQ-Lite © 2024 - Smart Vermiculture Monitoring Platform
