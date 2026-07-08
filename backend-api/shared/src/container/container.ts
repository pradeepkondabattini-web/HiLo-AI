/**
 * Minimal typed Dependency Injection container (EOS-000 §24, EOS-001-P6 §6).
 *
 * DI is mandatory: business logic depends on interfaces, never instantiating
 * infrastructure directly. This lightweight container avoids a heavy framework while
 * enforcing the pattern. Register factories against typed tokens; resolve lazily as
 * singletons.
 */
export class Token<T> {
  constructor(readonly description: string) {}
  /** Phantom type marker so TypeScript can infer T at resolve sites. */
  declare readonly _type: T;
}

export function createToken<T>(description: string): Token<T> {
  return new Token<T>(description);
}

type Factory<T> = (container: Container) => T;

export class Container {
  private readonly factories = new Map<Token<unknown>, Factory<unknown>>();
  private readonly singletons = new Map<Token<unknown>, unknown>();

  /** Register a singleton factory for a token. Re-registering replaces the factory. */
  register<T>(token: Token<T>, factory: Factory<T>): this {
    this.factories.set(token as Token<unknown>, factory as Factory<unknown>);
    this.singletons.delete(token as Token<unknown>);
    return this;
  }

  /** Register an already-constructed value. */
  registerValue<T>(token: Token<T>, value: T): this {
    this.factories.set(token as Token<unknown>, () => value);
    this.singletons.set(token as Token<unknown>, value);
    return this;
  }

  /** Resolve a token, constructing (and caching) its singleton on first use. */
  resolve<T>(token: Token<T>): T {
    if (this.singletons.has(token as Token<unknown>)) {
      return this.singletons.get(token as Token<unknown>) as T;
    }
    const factory = this.factories.get(token as Token<unknown>);
    if (!factory) {
      throw new Error(`No provider registered for token "${token.description}"`);
    }
    const value = factory(this) as T;
    this.singletons.set(token as Token<unknown>, value);
    return value;
  }

  has<T>(token: Token<T>): boolean {
    return this.factories.has(token as Token<unknown>);
  }
}
