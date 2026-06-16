# VermIQ-Lite Complete Setup Guide 🚀

**From Zero to Running Dashboard - Step by Step**

This guide will walk you through setting up VermIQ-Lite from scratch, whether you're a complete beginner or an experienced developer.

---

## 📋 Table of Contents

1. [Prerequisites Installation](#1-prerequisites-installation)
2. [Download the Project](#2-download-the-project)
3. [Install Dependencies](#3-install-dependencies)
4. [Understanding npm Warnings](#4-understanding-npm-warnings)
5. [Run in Demo Mode](#5-run-in-demo-mode)
6. [Configure Firebase (Optional)](#6-configure-firebase-optional)
7. [Connect ESP32 Hardware (Optional)](#7-connect-esp32-hardware-optional)
8. [Deploy to Production](#8-deploy-to-production)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites Installation

### Step 1.1: Install Node.js

**What is Node.js?**
Node.js is a JavaScript runtime that lets you run the development server and build tools.

**Installation:**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended: 18.x or higher)
3. Run the installer
4. Follow the installation wizard (use default settings)
5. Restart your terminal/command prompt

**Verify Installation:**

```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```


### Step 1.2: Install Git (Optional)

**What is Git?**
Git is version control software used to download and manage code.

**Installation:**

1. Visit [git-scm.com](https://git-scm.com/)
2. Download the installer for your operating system
3. Run the installer (use default settings)
4. Restart your terminal

**Verify Installation:**

```bash
git --version
# Should show: git version 2.x.x
```

### Step 1.3: Choose a Code Editor (Optional)

**Recommended: Visual Studio Code**

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Download and install
3. Open VS Code
4. Install recommended extensions (VS Code will prompt you)

**Alternative Editors:**
- WebStorm
- Sublime Text
- Atom

---

## 2. Download the Project

### Option A: Clone with Git (Recommended)

```bash
# Navigate to where you want the project
cd D:\projects

# Clone the repository
git clone <repository-url>

# Navigate into the project folder
cd IoT-semester-project
```


### Option B: Download ZIP

1. Go to the repository page
2. Click the green **Code** button
3. Select **Download ZIP**
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt in that folder

**Windows:** Hold Shift + Right-click in folder → "Open PowerShell window here"
**Mac/Linux:** Right-click → "Open Terminal here"

---

## 3. Install Dependencies

### Step 3.1: Open Terminal in Project Folder

Make sure you're in the correct directory:

```bash
# Verify you're in the right place
dir
# (Windows) or
ls
# (Mac/Linux)

# You should see: package.json, src folder, README.md, etc.
```

### Step 3.2: Install npm Packages

**What does this do?**
This downloads all the required libraries and tools (React, TypeScript, Firebase, etc.) that the project needs to run.

```bash
npm install
```

**Expected output:**

```
added 301 packages, and audited 301 packages in 30s

47 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

**How long does this take?**
- First time: 1-3 minutes (depending on internet speed)
- Subsequent times: 10-30 seconds (npm uses cache)


---

## 4. Understanding npm Warnings

### The Security Audit Warning

**What you see:**

```
2 moderate severity vulnerabilities
```

**What this means:**
- Two of the dependencies (or their sub-dependencies) have known security issues
- These are flagged as "moderate" risk (not critical)
- They're likely in packages your dependencies use, not ones you directly installed

**Do you need to fix it?**

**For Development/Learning Projects:** ❌ No
- The vulnerabilities likely don't affect your use case
- They might only affect server-side code (not your frontend app)
- You can safely ignore them

**For Production Projects:** ⚠️ Maybe
- Run `npm audit` to see detailed information
- Run `npm audit fix` to attempt automatic fixes
- Some vulnerabilities can't be auto-fixed

### Check What the Vulnerabilities Are

```bash
npm audit
```

This shows:
- Which packages have issues
- What type of vulnerability
- Whether it affects your code
- How to fix it

### Fix Vulnerabilities (Optional)

```bash
# Try automatic fix
npm audit fix

# If that doesn't work, try force fix (may break things)
npm audit fix --force

# Better approach: Wait for dependency updates
# Most vulnerabilities get fixed in newer versions
```


### Suppress Audit Warnings (Optional)

If you don't want to see the warnings every time:

**Option 1: Install without audit**

```bash
npm install --no-audit
```

**Option 2: Add to package.json** (permanent setting)

Add this to your `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "postinstall": "echo Skipping security audit for development"
}
```

**Option 3: Run audit only when needed**

```bash
# Normal install (skips audit)
npm install --no-audit

# Manual audit when you want to check
npm audit
```

---

## 5. Run in Demo Mode

### Step 5.1: Start Development Server

```bash
npm run dev
```

**Expected output:**

```
  VITE v5.4.11  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```


### Step 5.2: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Navigate to: `http://localhost:5173`
3. You should see the VermIQ-Lite landing page

**Troubleshooting:**
- If port 5173 is in use: The terminal will show an alternative port (like 5174)
- If browser doesn't open: Manually copy the URL from terminal

### Step 5.3: Login with Demo Credentials

On the landing page:

1. Click **"Get Started"** or **"Login"**
2. Enter demo credentials:
   - **Email:** `demo@vermiq.com`
   - **Password:** `password`
3. Click **"Sign In"**

**What happens:**
- You'll be logged into demo mode
- Simulated sensor data will start updating
- All dashboard features are available
- No Firebase or hardware needed

### Step 5.4: Explore the Dashboard

**Overview Page (Home):**
- Real-time metric cards (Moisture, Temperature, Humidity)
- Harvest progress tracker
- Node status panel
- Quick navigation cards

**Try these features:**
1. Watch metrics update every 2.5 seconds
2. Click different sections in the sidebar
3. Check the Alerts page (bell icon)
4. View Analytics for charts and graphs
5. Switch between nodes using the dropdown


### Step 5.5: Understanding Demo Mode

**What's simulated:**

✅ **4 ESP32 Sensor Nodes:**
- ESP32-NODE-01: Healthy bed (optimal conditions)
- ESP32-NODE-02: Warning state (dry soil)
- ESP32-NODE-03: Critical state (very dry, hot)
- ESP32-NODE-04: Offline node

✅ **Real-time Data Updates:**
- Moisture levels (varying realistic values)
- Temperature readings
- Humidity percentages
- Timestamp updates

✅ **Alert System:**
- Automatic alert generation
- Threshold monitoring
- Toast notifications
- Alert history

✅ **All Dashboard Features:**
- Charts and visualizations
- Node management
- Settings configuration
- Data history

**What's NOT real:**
- No actual sensors connected
- No Firebase cloud storage
- Data resets on page refresh
- Authentication is local only

### Step 5.6: Stop the Development Server

When you're done:

1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. Type `Y` if prompted
4. Server stops

---

## 6. Configure Firebase (Optional)

**Why use Firebase?**
- Real user authentication
- Cloud data storage
- Data persists across sessions
- Multi-device synchronization
- Production-ready backend

**When to skip:**
- Just testing the app
- Learning the interface
- Demo purposes only

---

### Step 6.1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: [console.firebase.google.com](https://console.firebase.google.com)
   - Sign in with Google account

2. **Create New Project**
   - Click **"Add project"**
   - Enter project name (e.g., "VermIQ-Prod")
   - Click **Continue**

3. **Google Analytics (Optional)**
   - Enable or disable (your choice)
   - Click **Continue**
   - If enabled, select or create Analytics account
   - Click **Create project**

4. **Wait for Setup**
   - Takes 30-60 seconds
   - Click **Continue** when done

---

### Step 6.2: Enable Authentication

1. **Navigate to Authentication**
   - In left sidebar, click **"Authentication"**
   - Click **"Get started"**

2. **Enable Email/Password**
   - Click **"Sign-in method"** tab
   - Click **"Email/Password"**
   - Toggle **"Enable"** switch
   - Click **"Save"**


---

### Step 6.3: Create Firestore Database

1. **Navigate to Firestore**
   - In left sidebar, click **"Firestore Database"**
   - Click **"Create database"**

2. **Choose Location**
   - Select region closest to you (e.g., us-central1)
   - Click **"Next"**

3. **Security Rules**
   - Select **"Start in production mode"** (more secure)
   - Click **"Create"**
   - Database takes 1-2 minutes to provision

4. **Update Security Rules (Important!)**
   
   Click **"Rules"** tab and replace with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow authenticated users to read/write their own data
       match /telemetry/{document=**} {
         allow read, write: if request.auth != null;
       }
       match /alerts/{document=**} {
         allow read, write: if request.auth != null;
       }
       match /nodes/{document=**} {
         allow read, write: if request.auth != null;
       }
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   Click **"Publish"**

---

### Step 6.4: Get Firebase Configuration

1. **Go to Project Settings**
   - Click gear icon (⚙️) next to "Project Overview"
   - Select **"Project settings"**

2. **Add Web App**
   - Scroll down to **"Your apps"**
   - Click web icon **</>**
   - Enter app nickname (e.g., "VermIQ Web")
   - **Don't** check "Firebase Hosting" (optional)
   - Click **"Register app"**


3. **Copy Configuration**
   
   You'll see code like this:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "vermiq-prod.firebaseapp.com",
     projectId: "vermiq-prod",
     storageBucket: "vermiq-prod.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

   **Keep this safe!** You'll need it in the next step.

---

### Step 6.5: Configure VermIQ with Firebase

**Method A: Environment Variables (Recommended)**

1. **Copy Example File**
   
   In your project folder:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Windows CMD
   copy .env.example .env

   # Mac/Linux
   cp .env.example .env
   ```

2. **Edit .env File**
   
   Open `.env` in your code editor and fill in your Firebase values:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=vermiq-prod.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=vermiq-prod
   VITE_FIREBASE_STORAGE_BUCKET=vermiq-prod.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Save the file**


**Method B: In-App Configuration (Alternative)**

1. Start the development server: `npm run dev`
2. Login with demo credentials
3. Navigate to **Settings** page
4. Scroll to **Firebase Configuration** section
5. Paste your entire `firebaseConfig` object
6. Click **"Save & Connect"**
7. Logout and restart the app

---

### Step 6.6: Restart and Test

1. **Stop the development server** (if running)
   - Press `Ctrl + C` in terminal

2. **Start again**
   ```bash
   npm run dev
   ```

3. **Create Real Account**
   - Go to `http://localhost:5173`
   - Click **"Sign Up"**
   - Enter your email and password
   - Click **"Create Account"**

4. **Verify Firebase Connection**
   - Check Firebase Console → Authentication
   - You should see your new user listed
   - Check Firestore Database
   - Collections should start appearing (telemetry, alerts, etc.)

**Success indicators:**
- ✅ Settings persist after page refresh
- ✅ Data visible in Firebase Console
- ✅ Alerts save to cloud
- ✅ Can login from different devices

---

## 7. Connect ESP32 Hardware (Optional)

**Prerequisites:**
- ESP32-WROOM-32 development board
- Capacitive soil moisture sensor
- DHT22 temperature/humidity sensor
- Arduino IDE installed
- USB cable
- Basic soldering skills (optional)

For complete ESP32 setup instructions, see: **[ESP32_INTEGRATION.md](ESP32_INTEGRATION.md)**

### Quick Hardware Overview

**Wiring Diagram:**

```
ESP32           →    Sensor
---------------------------------
3.3V            →    VCC (all sensors)
GND             →    GND (all sensors)
GPIO 15         →    DHT22 Data Pin
GPIO 34         →    Moisture Sensor Analog
```

**Software Setup:**

1. Install Arduino IDE
2. Install ESP32 board support
3. Install libraries (DHT, WiFi, PubSubClient)
4. Upload VermIQ ESP32 code
5. Configure WiFi and MQTT settings
6. Monitor Serial output for connection

**Expected Serial Output:**

```
Connecting to WiFi...
WiFi connected!
Connecting to MQTT broker...
MQTT connected!
Publishing telemetry...
```

**Dashboard Integration:**

Once ESP32 is connected and publishing MQTT data:
- Real sensor readings replace simulated data
- Node appears online in Nodes page
- Live telemetry updates in dashboard
- Alerts trigger based on real conditions

---

## 8. Deploy to Production

### Build for Production

```bash
# Create optimized production build
npm run build
```

**What happens:**
- TypeScript compiles to JavaScript
- Code is minified and optimized
- Output goes to `dist/` folder
- Build takes 30-60 seconds

**Verify build:**

```bash
# Preview production build locally
npm run preview
```

Visit `http://localhost:4173` to test the production version.

---

### Option A: Deploy to Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Free SSL certificates
- Automatic deployments from Git
- Global CDN
- Free tier available

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow prompts:**
   - Setup and deploy? Y
   - Which scope? (Select your account)
   - Link to existing project? N
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for current)
   - Override settings? N

5. **Get your URL:**
   ```
   ✅ Production: https://your-project.vercel.app
   ```

**Set Environment Variables:**

In Vercel Dashboard:
1. Go to project settings
2. Navigate to **Environment Variables**
3. Add all `VITE_*` variables from your `.env`
4. Redeploy


---

### Option B: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Set environment variables:**
   ```bash
   netlify env:set VITE_FIREBASE_API_KEY your_key
   netlify env:set VITE_FIREBASE_AUTH_DOMAIN your_domain
   # ... repeat for all variables
   ```

---

### Option C: Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   ```bash
   firebase init hosting
   ```

   Select:
   - Use existing project (your Firebase project)
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub deployment: No

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

5. **Your URL:**
   ```
   Hosting URL: https://your-project.web.app
   ```

---

## 9. Troubleshooting

### Common Issues and Solutions

---

#### Issue: `npm install` fails

**Error:** `ENOENT: no such file or directory`

**Solution:**
```bash
# Make sure you're in the project directory
cd D:\projects\IoT-semester-project

# Verify package.json exists
dir package.json
```

---

#### Issue: Port 5173 already in use

**Error:** `Port 5173 is in use`

**Solution 1:** Kill the existing process

```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or use a different port
npm run dev -- --port 3000
```

**Solution 2:** Find and close the other app using the port

---

#### Issue: Firebase connection fails

**Symptoms:**
- Login doesn't work
- Data doesn't save
- Console shows Firebase errors

**Solutions:**

1. **Check environment variables**
   ```bash
   # Make sure .env file exists and has values
   type .env
   ```

2. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Verify Firebase config**
   - Check Firebase Console
   - Ensure Authentication is enabled
   - Verify Firestore is created
   - Check domain is authorized

4. **Clear browser data**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"


---

#### Issue: Build fails with TypeScript errors

**Error:** `TS2307: Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install

# If still failing, update TypeScript
npm install --save-dev typescript@latest
```

---

#### Issue: White screen after deployment

**Symptoms:**
- Works locally
- Blank page in production

**Solutions:**

1. **Check browser console** (F12)
   - Look for errors
   - Check if files are loading

2. **Verify build configuration**
   - Ensure base URL is correct in `vite.config.ts`
   - Check Firebase config is set in production

3. **Clear CDN cache**
   - In deployment platform, clear cache
   - Try incognito/private window

---

#### Issue: Demo mode not working

**Symptoms:**
- No data updates
- Metrics show 0

**Solution:**
```bash
# Clear localStorage
# In browser console (F12):
localStorage.clear()
location.reload()
```

---

#### Issue: npm audit warnings persist

**Not really an issue**, but if it bothers you:

```bash
# Install without audit checks
npm install --no-audit

# Or fix automatically
npm audit fix
```


---

### Getting Help

**Check these resources:**

1. **Project Documentation**
   - [README.md](README.md) - Complete feature documentation
   - [QUICK_START.md](QUICK_START.md) - Quick reference guide
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment instructions
   - [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md) - Hardware setup

2. **Browser Developer Tools**
   - Press F12 to open DevTools
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Common Commands Reference**

   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev

   # Build for production
   npm run build

   # Preview production build
   npm run preview

   # Check for code issues
   npm run lint

   # Clean install (if issues persist)
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

---

## 🎉 You're All Set!

You now have a fully functional VermIQ-Lite dashboard!

### Quick Checklist

- ✅ Node.js and npm installed
- ✅ Project downloaded
- ✅ Dependencies installed
- ✅ Development server running
- ✅ Can access dashboard at http://localhost:5173
- ⬜ Firebase configured (optional)
- ⬜ ESP32 hardware connected (optional)
- ⬜ Deployed to production (optional)


### Next Steps

**Learn the Dashboard:**
- Explore each section (Overview, Analytics, Alerts, Beds, Nodes)
- Try adjusting thresholds in Settings
- Switch between different nodes
- Check out the Analytics charts

**Customize:**
- Modify threshold values
- Change color schemes in `src/index.css`
- Add your own nodes in simulator
- Customize alerts

**Go Production:**
- Set up Firebase for real data
- Connect ESP32 hardware
- Deploy to cloud hosting
- Share with team members

---

## 📚 Additional Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### VermIQ-Lite Specific

- **README.md** - Architecture and features
- **QUICK_START.md** - 5-minute quick start
- **DEPLOYMENT.md** - Production deployment details
- **ESP32_INTEGRATION.md** - Hardware integration guide
- **CHANGELOG.md** - Version history

---

## 🆘 Still Stuck?

If you're still having issues:

1. **Read the error message carefully** - It usually tells you what's wrong
2. **Check browser console** (F12) - Look for red error messages
3. **Google the error** - Someone has likely encountered it before
4. **Review this guide** - Make sure you didn't skip a step
5. **Try a clean install** - Delete node_modules and reinstall

---

**Happy Monitoring! 🌱**

*VermIQ-Lite - Smart Vermiculture Monitoring Platform*

