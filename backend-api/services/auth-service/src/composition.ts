import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirebaseTokenVerifier, getFirebaseApp } from '@hilo/backend-shared';
import { AssignRolesUseCase } from './application/assign-roles.use-case.js';
import { BootstrapUserUseCase } from './application/bootstrap-user.use-case.js';
import { GetMeUseCase } from './application/get-me.use-case.js';
import { UpdateProfileUseCase } from './application/update-profile.use-case.js';
import { systemClock } from './domain/ports.js';
import { FirebaseRoleClaimsManager } from './infrastructure/firebase-role-claims.js';
import { FirestoreUserRepository } from './infrastructure/firestore-user-repository.js';
import type { AuthRouteDeps } from './presentation/auth.routes.js';

/**
 * Composition root (EOS-000 §24). The only place infrastructure is instantiated; use
 * cases receive their dependencies via constructor injection. Tests build
 * {@link AuthRouteDeps} from in-memory fakes instead of calling this.
 */
export function buildAuthDeps(projectId: string): AuthRouteDeps {
  const app = getFirebaseApp(projectId);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const users = new FirestoreUserRepository(db);
  const roleClaims = new FirebaseRoleClaimsManager(auth);
  const clock = systemClock;

  return {
    verifier: new FirebaseTokenVerifier(auth),
    bootstrapUser: new BootstrapUserUseCase(users, roleClaims, clock),
    getMe: new GetMeUseCase(users),
    updateProfile: new UpdateProfileUseCase(users, clock),
    assignRoles: new AssignRolesUseCase(users, roleClaims, clock),
  };
}
