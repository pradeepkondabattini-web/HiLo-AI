import 'package:flutter/material.dart';

/// Central Material 3 theming for HiLo (EOS-000 §21, EOS-003-P2 §4).
///
/// Light and dark schemes are derived from a single brand seed color so the
/// palette stays harmonious and accessible. Widgets read colors from
/// `Theme.of(context).colorScheme` — never hardcoded values.
class AppTheme {
  const AppTheme._();

  /// HiLo brand seed color.
  static const Color seedColor = Color(0xFF6C4DFF);

  static ThemeData light() => _base(Brightness.light);
  static ThemeData dark() => _base(Brightness.dark);

  static ThemeData _base(Brightness brightness) {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: brightness,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.onSurface,
        centerTitle: true,
        elevation: 0,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}
