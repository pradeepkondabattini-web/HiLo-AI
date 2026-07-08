// ⚠️ GENERATED PLACEHOLDER — NOT REAL CONFIG.
//
// Replace this file by running (from flutter-app/):
//   dart pub global activate flutterfire_cli
//   flutterfire configure --project=hilo-23078
//
// flutterfire will register the Android/iOS/Web apps and write real values here.
// These placeholder values only let the project compile, analyze, and run widget tests
// (which stub Firebase) BEFORE the real config exists — the app will NOT connect to
// Firebase until you regenerate this file. Do not ship these values.
//
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] per platform (placeholder — see header).
class DefaultFirebaseOptions {
  const DefaultFirebaseOptions._();

  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not configured for this platform. '
          'Run `flutterfire configure --project=hilo-23078`.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyC88DSsNeAGDDRsPWxOQRPoo4YPu9hBrW4',
    appId: '1:1086284360366:web:029d7956ecff03eec89b3f',
    messagingSenderId: '1086284360366',
    projectId: 'hilo-23078',
    authDomain: 'hilo-23078.firebaseapp.com',
    storageBucket: 'hilo-23078.firebasestorage.app',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCm4BNiZpX_N4R-hk9jWh0hRWKHC8XHnt4',
    appId: '1:1086284360366:android:9294aac62e51be65c89b3f',
    messagingSenderId: '1086284360366',
    projectId: 'hilo-23078',
    storageBucket: 'hilo-23078.firebasestorage.app',
  );
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDl6514KU67dQLJ8amBvcYhe4xHjSIR7to',
    appId: '1:1086284360366:ios:ed3573aecdd8a441c89b3f',
    messagingSenderId: '1086284360366',
    projectId: 'hilo-23078',
    storageBucket: 'hilo-23078.firebasestorage.app',
    iosBundleId: 'ai.hilo.hilo',
  );
}
