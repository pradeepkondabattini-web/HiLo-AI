import type { AuthProvider } from '../domain/user.js';

/** Map a Firebase `sign_in_provider` claim to our {@link AuthProvider} enum. */
export function mapSignInProvider(signInProvider: string | undefined): AuthProvider {
  switch (signInProvider) {
    case 'google.com':
      return 'google';
    case 'phone':
      return 'phone';
    case 'password':
    default:
      return 'email';
  }
}
