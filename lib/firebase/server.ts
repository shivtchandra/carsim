import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { assertFirebaseConfig, firebaseConfig } from "./config";

/** Firebase init for scripts / server contexts (no "use client"). */
export function getServerDb() {
  assertFirebaseConfig();
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}
