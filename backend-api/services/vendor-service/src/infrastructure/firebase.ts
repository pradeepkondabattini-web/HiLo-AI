import { applicationDefault, getApps, initializeApp, type App } from 'firebase-admin/app';

/**
 * Lazily initialize (and reuse) the Firebase Admin app. Against the Emulator Suite the
 * Admin SDK auto-detects `FIRESTORE_EMULATOR_HOST`; in production it uses Application
 * Default Credentials. Credentials are never read from source (EOS-000 §71).
 */
export function getFirebaseApp(projectId: string): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const usingEmulator = Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ?? process.env.FIREBASE_AUTH_EMULATOR_HOST,
  );
  return initializeApp(
    usingEmulator ? { projectId } : { credential: applicationDefault(), projectId },
  );
}
