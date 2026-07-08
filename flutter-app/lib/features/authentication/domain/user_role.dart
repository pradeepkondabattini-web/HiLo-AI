/// Platform roles (EOS-002-P3-Part-02 §4, ADR-008). A user may hold multiple roles.
/// Domain layer — no framework dependencies.
enum UserRole {
  consumer,
  guest,
  business,
  admin;

  /// Wire key used by the backend (`roles: string[]`).
  String get key => name;

  String get label => switch (this) {
    UserRole.consumer => 'Consumer',
    UserRole.guest => 'Guest',
    UserRole.business => 'Business',
    UserRole.admin => 'Administrator',
  };

  static UserRole? fromKey(String key) => switch (key) {
    'consumer' => UserRole.consumer,
    'guest' => UserRole.guest,
    'business' => UserRole.business,
    'admin' => UserRole.admin,
    _ => null,
  };

  /// Roles a user may choose for themselves during onboarding (never `admin`).
  static const List<UserRole> selectableAtOnboarding = [
    UserRole.consumer,
    UserRole.business,
  ];
}
