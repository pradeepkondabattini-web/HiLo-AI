import 'package:logger/logger.dart';

/// Thin wrapper over the `logger` package (EOS-003-P2 §4).
///
/// Provides a single app-wide logger. Never log secrets, tokens, or PII
/// (EOS-000 §27, §84). Prefer this over `print` (banned by the analyzer).
class AppLogger {
  const AppLogger._();

  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 6,
      lineLength: 100,
      colors: true,
      printEmojis: false,
    ),
  );

  static void debug(String message, [Object? error, StackTrace? stackTrace]) =>
      _logger.d(message, error: error, stackTrace: stackTrace);

  static void info(String message, [Object? error, StackTrace? stackTrace]) =>
      _logger.i(message, error: error, stackTrace: stackTrace);

  static void warning(String message, [Object? error, StackTrace? stackTrace]) =>
      _logger.w(message, error: error, stackTrace: stackTrace);

  static void error(String message, [Object? error, StackTrace? stackTrace]) =>
      _logger.e(message, error: error, stackTrace: stackTrace);
}
