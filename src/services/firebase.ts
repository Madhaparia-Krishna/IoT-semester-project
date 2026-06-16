import { initializeApp, getApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged as fbOnAuthStateChanged
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  query as firestoreQuery,
  orderBy,
  limit,
  Firestore,
  addDoc
} from 'firebase/firestore';
import {
  getDatabase,
  ref,
  onValue,
  off
} from 'firebase/database';
import type { Database } from 'firebase/database';

export interface FirebaseConfigSchema {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let realtimeDbInstance: Database | null = null;

// Try to load config from localStorage first, then fallback to import.meta.env
const STORAGE_KEY = 'vermiq_firebase_config';

export function getSavedFirebaseConfig(): FirebaseConfigSchema | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved firebase config', e);
  }

  // Check env
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig as FirebaseConfigSchema;
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfigSchema | null) {
  if (config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function isFirebaseConfigured(): boolean {
  return appInstance !== null || getSavedFirebaseConfig() !== null;
}

export function initFirebaseConnection(): boolean {
  const config = getSavedFirebaseConfig();
  if (!config) {
    appInstance = null;
    authInstance = null;
    dbInstance = null;
    realtimeDbInstance = null;
    return false;
  }

  try {
    if (getApps().length === 0) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    
    // Initialize Realtime Database if databaseURL is provided
    if (config.databaseURL) {
      realtimeDbInstance = getDatabase(appInstance);
      console.log('Firebase Realtime Database successfully initialized!');
    }
    
    console.log('Firebase successfully initialized!');
    return true;
  } catch (err) {
    console.error('Error initializing Firebase with saved configuration:', err);
    appInstance = null;
    authInstance = null;
    dbInstance = null;
    realtimeDbInstance = null;
    return false;
  }
}

// Initial self-connection check
initFirebaseConnection();

// Types for authentication user
export interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'operator';
  isMock: boolean;
}

// MOCK USER STORE FOR DEMO MODE
const MOCK_USERS_KEY = 'vermiq_mock_users';
const CURRENT_MOCK_USER_KEY = 'vermiq_current_mock_user';

function getMockUsers() {
  try {
    const list = localStorage.getItem(MOCK_USERS_KEY);
    return list ? JSON.parse(list) : { 'demo@vermiq.com': { password: 'password', uid: 'mock-uid-1', name: 'Demo Operator', role: 'operator' } };
  } catch {
    return {};
  }
}

// Authentication Service Wrapper
export const authService = {
  login: async (email: string, password: string): Promise<UserSession> => {
    if (isFirebaseConfigured() && authInstance) {
      const credential = await signInWithEmailAndPassword(authInstance, email, password);
      return {
        uid: credential.user.uid,
        email: credential.user.email || '',
        displayName: credential.user.displayName || 'VermIQ User',
        role: 'operator', // Default role
        isMock: false
      };
    } else {
      // Mock Login
      const users = getMockUsers();
      const user = users[email.toLowerCase()];
      if (user && user.password === password) {
        const session: UserSession = {
          uid: user.uid,
          email: email.toLowerCase(),
          displayName: user.name,
          role: user.role,
          isMock: true
        };
        localStorage.setItem(CURRENT_MOCK_USER_KEY, JSON.stringify(session));
        return session;
      }
      throw new Error('Invalid email or password (Demo credentials: demo@vermiq.com / password)');
    }
  },

  signup: async (email: string, password: string, name: string): Promise<UserSession> => {
    if (isFirebaseConfigured() && authInstance) {
      const credential = await createUserWithEmailAndPassword(authInstance, email, password);
      return {
        uid: credential.user.uid,
        email: credential.user.email || '',
        displayName: name,
        role: 'operator',
        isMock: false
      };
    } else {
      // Mock Signup
      const users = getMockUsers();
      if (users[email.toLowerCase()]) {
        throw new Error('User already exists in demo storage.');
      }
      const uid = 'mock-uid-' + Math.random().toString(36).substr(2, 9);
      users[email.toLowerCase()] = { password, uid, name, role: 'operator' };
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

      const session: UserSession = {
        uid,
        email: email.toLowerCase(),
        displayName: name,
        role: 'operator',
        isMock: true
      };
      localStorage.setItem(CURRENT_MOCK_USER_KEY, JSON.stringify(session));
      return session;
    }
  },

  logout: async (): Promise<void> => {
    if (isFirebaseConfigured() && authInstance) {
      await signOut(authInstance);
    } else {
      localStorage.removeItem(CURRENT_MOCK_USER_KEY);
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    if (isFirebaseConfigured() && authInstance) {
      await sendPasswordResetEmail(authInstance, email);
    } else {
      const users = getMockUsers();
      if (!users[email.toLowerCase()]) {
        throw new Error('Email not found in demo storage.');
      }
      // Success simulation
    }
  },

  onAuthStateChanged: (callback: (user: UserSession | null) => void) => {
    if (isFirebaseConfigured() && authInstance) {
      return fbOnAuthStateChanged(authInstance, (user) => {
        if (user) {
          callback({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'VermIQ User',
            role: 'operator',
            isMock: false
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Mock Auth listener check
      const check = () => {
        const saved = localStorage.getItem(CURRENT_MOCK_USER_KEY);
        if (saved) {
          try {
            callback(JSON.parse(saved));
          } catch {
            callback(null);
          }
        } else {
          callback(null);
        }
      };
      check();
      
      // Simple custom listener for local storage changes or auth state updates
      const handler = () => check();
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
  }
};

// Database Service Wrapper
export const dbService = {
  // Save an alert triggered by sensor limits
  logAlert: async (alert: {
    nodeId: string;
    bedName: string;
    type: string;
    message: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
  }) => {
    const fullAlert = {
      ...alert,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      id: 'alert-' + Math.random().toString(36).substr(2, 9),
    };

    if (isFirebaseConfigured() && dbInstance) {
      try {
        await addDoc(collection(dbInstance, 'alerts'), fullAlert);
      } catch (err) {
        console.error('Failed to log alert to firestore', err);
      }
    } else {
      // Mock Storage log
      try {
        const saved = localStorage.getItem('vermiq_mock_alerts') || '[]';
        const alertsList = JSON.parse(saved);
        alertsList.unshift(fullAlert);
        localStorage.setItem('vermiq_mock_alerts', JSON.stringify(alertsList.slice(0, 100)));
      } catch (e) {
        console.error('Mock storage log alert error', e);
      }
    }
    return fullAlert;
  },

  // Read list of active alerts
  subscribeToAlerts: (callback: (alerts: any[]) => void) => {
    if (isFirebaseConfigured() && dbInstance) {
      const q = firestoreQuery(collection(dbInstance, 'alerts'), orderBy('timestamp', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        callback(list);
      });
    } else {
      const fetchMock = () => {
        try {
          const saved = localStorage.getItem('vermiq_mock_alerts') || '[]';
          callback(JSON.parse(saved));
        } catch {
          callback([]);
        }
      };
      
      fetchMock();
      const interval = setInterval(fetchMock, 3000);
      return () => clearInterval(interval);
    }
  },

  acknowledgeAlert: async (alertId: string) => {
    if (isFirebaseConfigured() && dbInstance) {
      try {
        const docRef = doc(dbInstance, 'alerts', alertId);
        await setDoc(docRef, { acknowledged: true }, { merge: true });
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const saved = localStorage.getItem('vermiq_mock_alerts') || '[]';
        const list = JSON.parse(saved).map((a: any) =>
          a.id === alertId ? { ...a, acknowledged: true } : a
        );
        localStorage.setItem('vermiq_mock_alerts', JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }
    }
  },

  clearAllAlerts: async () => {
    if (!isFirebaseConfigured()) {
      localStorage.setItem('vermiq_mock_alerts', '[]');
    }
  }
};

// Realtime Telemetry Service
export interface FirebaseSensorReading {
  timestamp_iso: string;
  timestamp_epoch_ms: number;
  reading_number: number;
  dht22_humidity: number;
  dht22_temp: number;
  moisture_percent: number;
  moisture_raw: number;
  ph: number;
  ph_raw: number;
  ph_voltage: number;
  source: string;
}

export const realtimeTelemetryService = {
  // Subscribe to real-time sensor data updates from latest_readings
  subscribeToLatestReadings: (callback: (data: FirebaseSensorReading | null) => void) => {
    if (realtimeDbInstance) {
      const latestReadingsRef = ref(realtimeDbInstance, 'latest_readings');
      
      onValue(latestReadingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as FirebaseSensorReading;
          callback(data);
        } else {
          console.warn('No data available at latest_readings');
          callback(null);
        }
      }, (error) => {
        console.error('Error subscribing to latest_readings:', error);
        callback(null);
      });

      // Return unsubscribe function
      return () => {
        off(latestReadingsRef);
      };
    } else {
      console.warn('Realtime Database not initialized, cannot subscribe to telemetry');
      return () => {};
    }
  },

  // Subscribe to historical readings from readings_history
  subscribeToReadingsHistory: (callback: (data: FirebaseSensorReading[]) => void, limitCount: number = 200) => {
    if (realtimeDbInstance) {
      const historyRef = ref(realtimeDbInstance, 'readings_history');
      
      onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const historyObj = snapshot.val();
          // Convert object to array and sort by timestamp
          const historyArray: FirebaseSensorReading[] = Object.values(historyObj);
          
          // Sort by timestamp_epoch_ms descending (newest first), then take the latest limitCount
          historyArray.sort((a, b) => b.timestamp_epoch_ms - a.timestamp_epoch_ms);
          const limitedHistory = historyArray.slice(0, limitCount);
          
          // Reverse to have oldest first for charts
          callback(limitedHistory.reverse());
        } else {
          console.warn('No data available at readings_history');
          callback([]);
        }
      }, (error) => {
        console.error('Error subscribing to readings_history:', error);
        callback([]);
      });

      // Return unsubscribe function
      return () => {
        off(historyRef);
      };
    } else {
      console.warn('Realtime Database not initialized, cannot subscribe to history');
      return () => {};
    }
  },

  // Check if Realtime Database is available
  isRealtimeDbAvailable: () => {
    return realtimeDbInstance !== null;
  }
};

// Firestore Telemetry Service (optional backup/alternative)
export const firestoreTelemetryService = {
  // Subscribe to sensor_readings collection from Firestore
  subscribeToSensorReadings: (callback: (data: FirebaseSensorReading[]) => void, limitCount: number = 200) => {
    if (dbInstance) {
      const readingsQuery = firestoreQuery(
        collection(dbInstance, 'sensor_readings'),
        orderBy('timestamp_epoch_ms', 'desc'),
        limit(limitCount)
      );
      
      return onSnapshot(readingsQuery, (snapshot) => {
        const readings: FirebaseSensorReading[] = [];
        snapshot.forEach((doc) => {
          readings.push(doc.data() as FirebaseSensorReading);
        });
        
        // Reverse to have oldest first for charts
        callback(readings.reverse());
      }, (error) => {
        console.error('Error subscribing to Firestore sensor_readings:', error);
        callback([]);
      });
    } else {
      console.warn('Firestore not initialized, cannot subscribe to sensor_readings');
      return () => {};
    }
  },

  // Check if Firestore is available
  isFirestoreAvailable: () => {
    return dbInstance !== null;
  }
};
