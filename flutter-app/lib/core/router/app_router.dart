import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/authentication/application/auth_providers.dart';
import '../../features/authentication/presentation/pages/email_sign_in_page.dart';
import '../../features/authentication/presentation/pages/onboarding_page.dart';
import '../../features/authentication/presentation/pages/phone_sign_in_page.dart';
import '../../features/authentication/presentation/pages/welcome_page.dart';
import '../../features/home/presentation/pages/home_page.dart';

/// Route path constants — referenced instead of raw strings.
class AppRoutes {
  const AppRoutes._();

  static const String home = '/';
  static const String welcome = '/welcome';
  static const String emailSignIn = '/sign-in/email';
  static const String phoneSignIn = '/sign-in/phone';
  static const String onboarding = '/onboarding';
}

/// Application router (EOS-003-P2 §9) with an authentication guard.
///
/// The guard redirects based on session state: signed-out users go to the welcome/sign-in
/// flow; signed-in-but-not-onboarded users go to onboarding; everyone else reaches the app.
/// It re-evaluates whenever the auth session ([authControllerProvider]) changes.
final routerProvider = Provider<GoRouter>((ref) {
  // Re-run the guard whenever the session changes. Tied to the auth controller (what the
  // guard reads) — not the raw auth stream — so redirects fire after the session resolves.
  final refresh = ValueNotifier<int>(0);
  ref.onDispose(refresh.dispose);
  ref.listen(authControllerProvider, (_, __) => refresh.value++);

  return GoRouter(
    initialLocation: AppRoutes.home,
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      // Don't redirect while the session is resolving — avoids flashes and loops.
      if (auth.isLoading) return null;

      final user = auth.valueOrNull;
      final location = state.matchedLocation;
      final atAuthRoute = location == AppRoutes.welcome || location.startsWith('/sign-in');
      final atOnboarding = location == AppRoutes.onboarding;

      if (user == null) {
        return atAuthRoute ? null : AppRoutes.welcome;
      }
      if (!user.hasCompletedOnboarding) {
        return atOnboarding ? null : AppRoutes.onboarding;
      }
      // Authenticated and onboarded — keep out of the auth/onboarding flow.
      if (atAuthRoute || atOnboarding) return AppRoutes.home;
      return null;
    },
    routes: <RouteBase>[
      GoRoute(
        path: AppRoutes.home,
        name: 'home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: AppRoutes.welcome,
        name: 'welcome',
        builder: (context, state) => const WelcomePage(),
      ),
      GoRoute(
        path: AppRoutes.emailSignIn,
        name: 'emailSignIn',
        builder: (context, state) => const EmailSignInPage(),
      ),
      GoRoute(
        path: AppRoutes.phoneSignIn,
        name: 'phoneSignIn',
        builder: (context, state) => const PhoneSignInPage(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
    ],
  );
});
