import { loadConfig, type AppConfig } from '@hilo/backend-shared';
import { SERVICE_NAME } from './server.js';

export interface VenueServiceConfig extends AppConfig {
  projectId: string;
  /** Google Maps Platform key — when set, the real Places adapter is used (future). */
  googleMapsApiKey?: string;
}

export function loadVenueConfig(env: NodeJS.ProcessEnv = process.env): VenueServiceConfig {
  const base = loadConfig({ serviceName: SERVICE_NAME, env });
  const projectId = env.FIREBASE_PROJECT_ID ?? env.GCLOUD_PROJECT ?? env.GOOGLE_CLOUD_PROJECT ?? '';
  if (!projectId) {
    throw new Error(
      'Missing project id: set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT / GOOGLE_CLOUD_PROJECT)',
    );
  }
  return { ...base, projectId, googleMapsApiKey: env.GOOGLE_MAPS_API_KEY };
}
