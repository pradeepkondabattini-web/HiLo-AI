import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../application/auth_controller.dart';
import '../../application/auth_providers.dart';

/// Shows a SnackBar whenever the auth session transitions into an error state.
/// Call from a page's `build` (it registers a `ref.listen`).
void listenForAuthErrors(WidgetRef ref, BuildContext context) {
  ref.listen(authControllerProvider, (previous, next) {
    if (next.hasError && !next.isLoading) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text(authErrorMessage(next.error))));
    }
  });
}
