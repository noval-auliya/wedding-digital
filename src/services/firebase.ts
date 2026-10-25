import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  inMemoryPersistence,
  initializeAuth,
} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfig = [
  config.apiKey,
  config.authDomain,
  config.projectId,
  config.appId,
];

export const isFirebaseConfigured = requiredConfig.every(Boolean);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firestore: Firestore | null = null;
let publicLikeAuth: Auth | null = null;
let publicLikeFirestore: Firestore | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(config);
  try {
    firebaseAuth = initializeAuth(firebaseApp, { persistence: browserLocalPersistence });
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
    if (code !== 'auth/already-initialized') throw error;
    firebaseAuth = getAuth(firebaseApp);
  }
  firestore = getFirestore(firebaseApp);

  const publicLikeAppName = 'wedding-public-likes';
  const publicLikeApp = getApps().find((app) => app.name === publicLikeAppName)
    || initializeApp(config, publicLikeAppName);
  try {
    publicLikeAuth = initializeAuth(publicLikeApp, { persistence: inMemoryPersistence });
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
    if (code !== 'auth/already-initialized') throw error;
    publicLikeAuth = getAuth(publicLikeApp);
  }
  publicLikeFirestore = getFirestore(publicLikeApp);
}

export { firebaseAuth, firestore, publicLikeAuth, publicLikeFirestore };
