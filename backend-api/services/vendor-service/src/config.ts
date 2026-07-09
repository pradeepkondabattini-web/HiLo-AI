import { loadConfig, type AppConfig } from '@hilo/backend-shared';
import { SERVICE_NAME } from './server.js';

export interface VendorServiceConfig extends AppConfig {
  projectId: string;
  /** Quote validity in days (EOS-002-P3-Part-06 §24 — configurable). */
  quoteValidityDays: number;
}

export function loadVendorConfig(env: NodeJS.ProcessEnv = process.env): VendorServiceConfig {
  const base = loadConfig({ serviceName: SERVICE_NAME, env });
  const projectId = env.FIREBASE_PROJECT_ID ?? env.GCLOUD_PROJECT ?? env.GOOGLE_CLOUD_PROJECT ?? '';
  if (!projectId) {
    throw new Error(
      'Missing project id: set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT / GOOGLE_CLOUD_PROJECT)',
    );
  }
  const quoteValidityDays = Number(env.QUOTE_VALIDITY_DAYS ?? 7);
  return { ...base, projectId, quoteValidityDays };
}
