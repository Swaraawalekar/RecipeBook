

import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA-fGDOZeJFZ9SNG9BN4swgOCmDMGT0DOo",
  authDomain: "recipebook-4a94b.firebaseapp.com",
  projectId: "recipebook-4a94b",
  storageBucket: "recipebook-4a94b.firebasestorage.app",
  messagingSenderId: "1086224928455",
  appId: "1:1086224928455:web:8b32fce4e3d7310b2bb8e2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);