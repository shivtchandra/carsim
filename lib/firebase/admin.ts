import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminDb: Firestore | undefined;

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  const decoded = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");

  const parsed = JSON.parse(decoded) as {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };

  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing project_id, client_email, or private_key.");
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = parseServiceAccount();
  return initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId: serviceAccount?.projectId ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getAdminApp());
  return adminDb;
}

export function assertWallAdminSecret(secret: string | null) {
  const expected = process.env.WALL_ADMIN_SECRET;
  if (!expected) {
    throw new Error("WALL_ADMIN_SECRET must be set.");
  }

  if (secret !== expected) {
    throw new Error("Unauthorized");
  }
}
