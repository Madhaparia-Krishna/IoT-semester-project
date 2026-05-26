# VermIQ-Lite Deployment Guide 🚀

Complete guide for deploying VermIQ-Lite to production environments.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Firebase Setup](#firebase-setup)
3. [Build Configuration](#build-configuration)
4. [Deployment Platforms](#deployment-platforms)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Firebase project created and configured
- [ ] Environment variables set
- [ ] Production build tested locally
- [ ] Security rules configured
- [ ] Authentication methods enabled
- [ ] Domain/subdomain ready (optional)
- [ ] SSL certificate configured (automatic on most platforms)

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: `vermiq-lite-prod`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** or other providers
4. Save changes

### 3. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (we'll add rules next)
4. Select region closest to your users
5. Click **Enable**

### 4. Configure Security Rules

Navigate to **Firestore** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Telemetry collection - authenticated users can read all, write their own
    match /telemetry/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Alerts collection - authenticated users can read all, write their own
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Devices/Nodes collection - authenticated users can read all
    match /devices/{deviceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Settings collection - users can only access their own settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

### 5. Get Firebase Config

1. Navigate to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (</>) to add web app
4. Register app with nickname: `VermIQ-Lite Web`
5. Copy the `firebaseConfig` object

---

## Build Configuration

### 1. Set Environment Variables

Create `.env.production` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=vermiq-lite-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vermiq-lite-prod
VITE_FIREBASE_STORAGE_BUCKET=vermiq-lite-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Build for Production

```bash
npm run build
```

This creates optimized production build in `dist/` directory.

### 3. Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Pros**: Zero-config, automatic HTTPS, global CDN, free tier

#### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Deploy via Git

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables from `.env.production`
7. Click **Deploy**

#### Custom Domain

1. Go to project settings
2. Navigate to **Domains**
3. Add your domain: `app.vermiq.com`
4. Follow DNS configuration instructions

---

### Option 2: Netlify

**Pros**: Easy setup, form handling, serverless functions

#### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Deploy via Git

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect to Git provider
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables
7. Click **Deploy site**

#### netlify.toml Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 3: Firebase Hosting

**Pros**: Integrated with Firebase backend, CDN, free SSL

#### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting
```

Select:
- **Public directory**: `dist`
- **Configure as SPA**: Yes
- **Automatic builds**: No

#### Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy --only hosting
```

#### firebase.json Configuration

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### Option 4: AWS Amplify

**Pros**: Enterprise scale, CI/CD, monitoring

#### Deploy via Console

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click **New app** → **Host web app**
3. Connect repository
4. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Add environment variables
6. Save and deploy

---

### Option 5: Docker

**Pros**: Portable, consistent environments, self-hosted

#### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Build and Run

```bash
# Build image
docker build -t vermiq-lite .

# Run container
docker run -p 8080:80 vermiq-lite
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  vermiq-lite:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run:

```bash
docker-compose up -d
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Visit deployed URL
- [ ] Test authentication (signup/login)
- [ ] Check real-time data updates
- [ ] Test alert system
- [ ] Verify Firebase connection
- [ ] Test on mobile devices
- [ ] Check browser console for errors

### 2. Configure Custom Domain

Most platforms provide automatic SSL with Let's Encrypt.

**DNS Configuration** (example for Vercel):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Set Up Monitoring

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

// In root component
<Analytics />
```

#### Firebase Performance Monitoring

```bash
npm install firebase
```

Enable in Firebase Console → Performance.

### 4. Configure Alerts

Set up uptime monitoring:
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://pingdom.com) - Paid
- [StatusCake](https://statuscake.com) - Free tier

---

## Troubleshooting

### Build Errors

**Error**: `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: `TypeScript errors`
```bash
# Check TypeScript config
npx tsc --noEmit
```

### Firebase Connection Issues

**Error**: `Firebase: Error (auth/configuration-not-found)`

- Verify environment variables are set correctly
- Check Firebase project settings
- Ensure Authentication is enabled

**Error**: `Firestore permission denied`

- Review Firestore security rules
- Ensure user is authenticated
- Check rule syntax

### Deployment Failures

**Vercel**: Check build logs in dashboard

**Netlify**: Review deploy log for errors

**Firebase**: Run `firebase deploy --debug`

### Performance Issues

1. **Enable compression** (automatic on most platforms)
2. **Optimize images** - Use WebP format
3. **Code splitting** - Already configured with Vite
4. **CDN caching** - Configure cache headers

### CORS Issues

If accessing external APIs, configure CORS:

**Vercel** - `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

---

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] Firebase security rules configured
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Authentication required for sensitive routes
- [ ] API keys restricted by domain
- [ ] Regular dependency updates (`npm audit`)
- [ ] Content Security Policy configured
- [ ] Rate limiting on authentication

---

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npx npm-check-updates -u
npm install
```

### Backup Strategy

- Firebase automatic backups (paid plan)
- Export Firestore data regularly
- Version control for code

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor Firebase usage
- Track user analytics
- Review security alerts

---

## Support

For deployment issues:
- Check platform documentation
- Review build logs
- Contact platform support
- Open GitHub issue

---

**Deployment Complete! 🎉**

Your VermIQ-Lite dashboard is now live and ready to monitor vermiculture operations in real-time.
