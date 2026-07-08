import 'package:dio/dio.dart';

/// Supplies the current Firebase ID token for the Authorization header.
typedef IdTokenProvider = Future<String?> Function({bool forceRefresh});

/// Builds a [Dio] client pointed at the backend that attaches the caller's Firebase ID
/// token to every request (EOS-000 §64). Shared by feature data sources so the token
/// injection isn't duplicated. The UI never calls Firestore directly.
Dio createAuthenticatedDio({
  required String baseUrl,
  required IdTokenProvider idTokenProvider,
}) {
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      sendTimeout: const Duration(seconds: 10),
      contentType: 'application/json',
    ),
  );
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await idTokenProvider();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ),
  );
  return dio;
}
