import { loadConfig, type AppConfig } from '@hilo/backend-shared';
import { SERVICE_NAME } from './server.js';

export interface EventServiceConfig extends AppConfig {
  /** GCP / Firebase project id (used by the Admin SDK). */
  projectId: string;
}

/**
 * Load event-service configuration. Extends the shared base config with the Firebase
 * project id. All values come from the environment — never hardcoded (EOS-000 §25).
 */
export function loadEventConfig(env: NodeJS.ProcessEnv = process.env): EventServiceConfig {
  const base = loadConfig({ serviceName: SERVICE_NAME, env });
  const projectId = env.FIREBASE_PROJECT_ID ?? env.GCLOUD_PROJECT ?? env.GOOGLE_CLOUD_PROJECT ?? '';
  if (!projectId) {
    throw new Error(
      'Missing project id: set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT / GOOGLE_CLOUD_PROJECT)',
    );
  }
  return { ...base, projectId };
}
