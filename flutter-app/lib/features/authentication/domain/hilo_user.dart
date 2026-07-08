import 'user_role.dart';

/// The HiLo platform user (profile + roles), as returned by auth-service.
/// Distinct from the Firebase identity — this is the domain aggregate the UI reasons about.
class HiloUser {
  const HiloUser({
    required this.id,
    required this.email,
    required this.displayName,
    required this.roles,
    required this.accountStatus,
    required this.emailVerified,
    required this.phoneVerified,
    this.phone,
    this.city,
    this.preferredLanguage,
    this.profilePhoto,
  });

  final String id;
  final String email;
  final String displayName;
  final List<UserRole> roles;
  final String accountStatus;
  final bool emailVerified;
  final bool phoneVerified;
  final String? phone;
  final String? city;
  final String? preferredLanguage;
  final String? profilePhoto;

  bool hasRole(UserRole role) => roles.contains(role);

  /// Onboarding is considered complete once the user has set their city
  /// (a lightweight proxy until the backend tracks an explicit flag).
  bool get hasCompletedOnboarding => (city ?? '').trim().isNotEmpty;

  HiloUser copyWith({
    String? displayName,
    List<UserRole>? roles,
    String? city,
    String? preferredLanguage,
    String? profilePhoto,
  }) {
    return HiloUser(
      id: id,
      email: email,
      displayName: displayName ?? this.displayName,
      roles: roles ?? this.roles,
      accountStatus: accountStatus,
      emailVerified: emailVerified,
      phoneVerified: phoneVerified,
      phone: phone,
      city: city ?? this.city,
      preferredLanguage: preferredLanguage ?? this.preferredLanguage,
      profilePhoto: profilePhoto ?? this.profilePhoto,
    );
  }
}
