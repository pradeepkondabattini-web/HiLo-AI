import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hilo/app/app.dart';
import 'package:hilo/features/authentication/application/auth_providers.dart';
import 'package:hilo/features/authentication/domain/auth_repository.dart';
import 'package:hilo/features/authentication/domain/hilo_user.dart';
import 'package:hilo/features/authentication/domain/user_role.dart';
import 'package:hilo/features/events/application/events_providers.dart';
import 'package:hilo/features/events/domain/create_event_input.dart';
import 'package:hilo/features/events/domain/event.dart';
import 'package:hilo/features/events/domain/event_budget.dart';
import 'package:hilo/features/events/domain/event_status.dart';
import 'package:hilo/features/events/domain/events_repository.dart';

/// Signed-in, onboarded user (city set) so the guard routes straight to the dashboard.
class _OnboardedAuthRepository implements AuthRepository {
  static const _user = HiloUser(
    id: 'uid1',
    email: 'pat@example.com',
    displayName: 'Pat',
    roles: [UserRole.consumer],
    accountStatus: 'active',
    emailVerified: true,
    phoneVerified: false,
    city: 'Hyderabad',
  );

  @override
  Stream<String?> authStateChanges() => Stream<String?>.value('uid1');
  @override
  String? get currentUid => 'uid1';
  @override
  Future<HiloUser> bootstrap() async => _user;
  @override
  Future<HiloUser> fetchMe() async => _user;
  @override
  Future<HiloUser> updateProfile({
    String? displayName,
    String? city,
    String? preferredLanguage,
    String? profilePhoto,
  }) async => _user;
  @override
  Future<void> signInWithGoogle() async {}
  @override
  Future<void> signInWithEmail({required String email, required String password}) async {}
  @override
  Future<void> registerWithEmail({required String email, required String password}) async {}
  @override
  Future<String> startPhoneVerification({required String phoneNumber}) async => 'v';
  @override
  Future<void> confirmPhoneCode({
    required String verificationId,
    required String smsCode,
  }) async {}
  @override
  Future<void> signOut() async {}
}

class _EmptyEventsRepository implements EventsRepository {
  @override
  Future<List<Event>> listEvents({int? limit, String? cursor}) async => const <Event>[];
  @override
  Future<Event> getEvent(String id) async => throw UnimplementedError();
  @override
  Future<(Event, EventBudget)> createEvent(CreateEventInput input) async =>
      throw UnimplementedError();
  @override
  Future<Event> transition(String id, EventStatus target) async => throw UnimplementedError();
  @override
  Future<void> deleteEvent(String id) async {}
}

void main() {
  testWidgets('onboarded user with no events sees the empty dashboard', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(_OnboardedAuthRepository()),
          eventsRepositoryProvider.overrideWithValue(_EmptyEventsRepository()),
        ],
        child: const HiLoApp(),
      ),
    );

    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.text('My Events'), findsOneWidget);
    expect(find.text('No events yet'), findsOneWidget);
    expect(find.text('Create event'), findsOneWidget); // FAB
  });
}
