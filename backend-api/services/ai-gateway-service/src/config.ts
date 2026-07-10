import { loadConfig, type AppConfig } from '@hilo/backend-shared';
import { SERVICE_NAME } from './server.js';

export interface AiGatewayConfig extends AppConfig {
  projectId: string;
  /** Base URL through which skills reach the other HiLo services (hosted origin). */
  servicesBaseUrl: string;
}

export function loadAiConfig(env: NodeJS.ProcessEnv = process.env): AiGatewayConfig {
  const base = loadConfig({ serviceName: SERVICE_NAME, env });
  const projectId = env.FIREBASE_PROJECT_ID ?? env.GCLOUD_PROJECT ?? env.GOOGLE_CLOUD_PROJECT ?? '';
  if (!projectId) {
    throw new Error(
      'Missing project id: set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT / GOOGLE_CLOUD_PROJECT)',
    );
  }
  return {
    ...base,
    projectId,
    servicesBaseUrl: env.SERVICES_BASE_URL ?? 'https://hilo-23078.web.app',
  };
}
