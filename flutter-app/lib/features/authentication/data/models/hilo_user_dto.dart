import '../../domain/hilo_user.dart';
import '../../domain/user_role.dart';

/// Maps the auth-service `UserDto` JSON into the domain [HiloUser].
class HiloUserDto {
  const HiloUserDto._();

  static HiloUser fromJson(Map<String, dynamic> json) {
    final rawRoles = (json['roles'] as List<dynamic>?) ?? const <dynamic>[];
    final roles = rawRoles
        .whereType<String>()
        .map(UserRole.fromKey)
        .whereType<UserRole>()
        .toList(growable: false);

    return HiloUser(
      id: json['id'] as String,
      email: (json['email'] as String?) ?? '',
      displayName: (json['displayName'] as String?) ?? '',
      roles: roles.isEmpty ? const [UserRole.consumer] : roles,
      accountStatus: (json['accountStatus'] as String?) ?? 'active',
      emailVerified: (json['emailVerified'] as bool?) ?? false,
      phoneVerified: (json['phoneVerified'] as bool?) ?? false,
      phone: json['phone'] as String?,
      city: json['city'] as String?,
      preferredLanguage: json['preferredLanguage'] as String?,
      profilePhoto: json['profilePhoto'] as String?,
    );
  }
}
