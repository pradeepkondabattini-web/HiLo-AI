import 'package:dio/dio.dart';

import '../../domain/auth_failure.dart';
import '../../domain/hilo_user.dart';
import '../models/hilo_user_dto.dart';

/// Supplies the current Firebase ID token for the Authorization header.
typedef IdTokenProvider = Future<String?> Function({bool forceRefresh});

/// Talks to auth-service (Cloud Run) over HTTPS (EOS-002-P3-Part-02, EOS-000 §64).
/// Attaches the verified Firebase ID token to every request; the UI never calls Firestore
/// directly. Translates transport/HTTP errors into typed [AuthException]s.
class AuthApiDataSource {
  AuthApiDataSource({required Dio dio, required IdTokenProvider idTokenProvider})
    : _dio = dio {
    _dio.interceptors.add(
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
  }

  final Dio _dio;

  Future<HiloUser> bootstrap() => _requestUser(() => _dio.post('/api/v1/auth/bootstrap'));

  Future<HiloUser> fetchMe() => _requestUser(() => _dio.get('/api/v1/auth/me'));

  Future<HiloUser> updateProfile(Map<String, dynamic> body) =>
      _requestUser(() => _dio.patch('/api/v1/auth/me', data: body));

  Future<HiloUser> _requestUser(Future<Response<dynamic>> Function() send) async {
    try {
      final res = await send();
      final data = res.data;
      if (data is! Map<String, dynamic>) {
        throw const AuthException(UnknownAuthFailure());
      }
      return HiloUserDto.fromJson(data);
    } on DioException catch (e) {
      throw _map(e);
    }
  }

  AuthException _map(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionError:
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const AuthException(NetworkFailure());
      default:
        break;
    }
    final status = e.response?.statusCode;
    return switch (status) {
      401 => const AuthException(
        InvalidCredentialsFailure('Your session has expired. Please sign in again.'),
      ),
      403 => const AuthException(AccountDisabledFailure()),
      _ => const AuthException(UnknownAuthFailure()),
    };
  }
}
