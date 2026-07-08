import 'package:flutter/material.dart';

/// Shared, reusable loading indicator (EOS-000 §17 — `shared/` holds cross-feature
/// widgets). Centered progress spinner used across features while async work runs.
class AppLoadingIndicator extends StatelessWidget {
  const AppLoadingIndicator({super.key, this.semanticLabel});

  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: CircularProgressIndicator(semanticsLabel: semanticLabel),
    );
  }
}
