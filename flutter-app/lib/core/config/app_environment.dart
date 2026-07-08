/// Runtime environment configuration (EOS-000 §25, EOS-001-P6 §13).
///
/// Values are supplied at build time via `--dart-define` and never hardcoded.
/// Secrets are never stored here — only non-sensitive, environment-varying values
/// such as the backend base URL.
enum AppFlavor { development, staging, production }

class AppEnvironment {
  const AppEnvironment._();

  static const String _flavorName =
      String.fromEnvironment('APP_FLAVOR', defaultValue: 'development');

  /// Base URL for the backend API gateway. Injected per environment.
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080',
  );

  static AppFlavor get flavor => switch (_flavorName) {
        'production' => AppFlavor.production,
        'staging' => AppFlavor.staging,
        _ => AppFlavor.development,
      };

  static bool get isProduction => flavor == AppFlavor.production;
}
