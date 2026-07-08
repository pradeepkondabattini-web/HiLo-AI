// Runs the whole local backend for the Flutter app in ONE command:
// auth-service (:8081) + event-service (:8082) + the dev gateway (:8000),
// all pointed at the Firebase Emulator Suite. ZERO dependencies.
//
//   node devops/dev-gateway/dev-backend.mjs
//
// Prereq (separate terminal): `firebase emulators:start` (Auth :9099, Firestore :8080).
// Then run the app:
//   flutter run -d chrome --dart-define=USE_FIREBASE_EMULATOR=true \
//     --dart-define=API_BASE_URL=http://localhost:8000

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendApi = path.resolve(here, '../../backend-api');

const emulatorEnv = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? 'hilo-23078',
  FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST ?? 'localhost:9099',
  FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST ?? 'localhost:8080',
  NODE_ENV: 'development',
};

const specs = [
  {
    name: 'auth ',
    cmd: 'npm',
    args: ['run', 'dev', '-w', '@hilo/auth-service'],
    cwd: backendApi,
    env: { ...emulatorEnv, PORT: '8081' },
  },
  {
    name: 'event',
    cmd: 'npm',
    args: ['run', 'dev', '-w', '@hilo/event-service'],
    cwd: backendApi,
    env: { ...emulatorEnv, PORT: '8082' },
  },
  {
    name: 'gate ',
    cmd: process.execPath,
    args: [path.join(here, 'gateway.mjs')],
    cwd: here,
    env: {
      GATEWAY_PORT: '8000',
      AUTH_TARGET: 'http://localhost:8081',
      EVENTS_TARGET: 'http://localhost:8082',
    },
  },
];

const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try {
      child.kill();
    } catch {
      // ignore
    }
  }
  process.exit(code);
}

for (const spec of specs) {
  const child = spawn(spec.cmd, spec.args, {
    cwd: spec.cwd,
    env: { ...process.env, ...spec.env },
    shell: process.platform === 'win32',
  });
  child.stdout.on('data', (d) => process.stdout.write(`[${spec.name}] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[${spec.name}] ${d}`));
  child.on('exit', (code) => {
    console.log(`[dev-backend] "${spec.name.trim()}" exited (${code}); shutting everything down.`);
    shutdown(code ?? 0);
  });
  children.push(child);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('[dev-backend] auth :8081 · event :8082 · gateway :8000');
console.log('[dev-backend] ensure the emulators are running: firebase emulators:start');
