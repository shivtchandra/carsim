"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { assertFirebaseConfig, firebaseConfig } from "./config";

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let analyticsInit: Promise<Analytics | null> | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  assertFirebaseConfig();
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

/** Firestore — primary DB for client reads/writes. */
export function getDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}

/** Analytics — browser only; returns null during SSR or when unsupported. */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!analyticsInit) {
    analyticsInit = isSupported().then((supported) =>
      supported ? getAnalytics(getFirebaseApp()) : null
    );
  }
  return analyticsInit;
}
