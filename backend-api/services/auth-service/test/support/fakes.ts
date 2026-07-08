import { createLogger, type TokenVerifier, type VerifiedIdentity } from '@hilo/backend-shared';
import type { Clock, RoleClaimsManager } from '../../src/domain/ports.js';
import type { Role } from '../../src/domain/role.js';
import { AssignRolesUseCase } from '../../src/application/assign-roles.use-case.js';
import { BootstrapUserUseCase } from '../../src/application/bootstrap-user.use-case.js';
import { GetMeUseCase } from '../../src/application/get-me.use-case.js';
import { UpdateProfileUseCase } from '../../src/application/update-profile.use-case.js';
import { InMemoryUserRepository } from '../../src/infrastructure/in-memory-user-repository.js';
import type { AuthRouteDeps } from '../../src/presentation/auth.routes.js';
import { buildApp } from '../../src/server.js';

/** Verifier that resolves preset identities keyed by token string; unknown → throws. */
export class FakeTokenVerifier implements TokenVerifier {
  private readonly registry = new Map<string, VerifiedIdentity>();

  register(token: string, identity: VerifiedIdentity): this {
    this.registry.set(token, identity);
    return this;
  }

  async verify(token: string): Promise<VerifiedIdentity> {
    const identity = this.registry.get(token);
    if (!identity) {
      const { AppError } = await import('@hilo/backend-shared');
      throw AppError.unauthorized('Invalid or expired authentication token');
    }
    return identity;
  }
}

/** Records the roles written per uid so tests can assert claim propagation. */
export class FakeRoleClaimsManager implements RoleClaimsManager {
  readonly calls: Array<{ uid: string; roles: Role[] }> = [];
  async setRoles(uid: string, roles: Role[]): Promise<void> {
    this.calls.push({ uid, roles });
  }
}

export function fixedClock(iso = '2026-07-05T10:00:00.000Z'): Clock {
  return { now: () => new Date(iso) };
}

export interface TestHarness {
  app: ReturnType<typeof buildApp>;
  users: InMemoryUserRepository;
  verifier: FakeTokenVerifier;
  roleClaims: FakeRoleClaimsManager;
  deps: AuthRouteDeps;
}

/** Build the auth-service app wired to in-memory fakes — no Firebase required. */
export function buildTestHarness(): TestHarness {
  const users = new InMemoryUserRepository();
  const verifier = new FakeTokenVerifier();
  const roleClaims = new FakeRoleClaimsManager();
  const clock = fixedClock();

  const deps: AuthRouteDeps = {
    verifier,
    bootstrapUser: new BootstrapUserUseCase(users, roleClaims, clock),
    getMe: new GetMeUseCase(users),
    updateProfile: new UpdateProfileUseCase(users, clock),
    assignRoles: new AssignRolesUseCase(users, roleClaims, clock),
  };

  const logger = createLogger({
    serviceName: 'auth-service',
    environment: 'test',
    level: 'error',
    sink: () => {},
  });

  return { app: buildApp(logger, deps), users, verifier, roleClaims, deps };
}
