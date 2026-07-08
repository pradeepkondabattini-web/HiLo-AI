import '../../domain/event_budget.dart';

/// Maps the event-service `BudgetDto` JSON into the domain [EventBudget].
class EventBudgetDto {
  const EventBudgetDto._();

  static EventBudget fromJson(Map<String, dynamic> json) {
    final rawAllocations = (json['allocations'] as List<dynamic>?) ?? const <dynamic>[];
    return EventBudget(
      id: json['id'] as String? ?? '',
      eventId: json['eventId'] as String? ?? '',
      currency: json['currency'] as String? ?? 'INR',
      totalAmount: (json['totalAmount'] as num?) ?? 0,
      contingencyAmount: (json['contingencyAmount'] as num?) ?? 0,
      allocations: rawAllocations
          .whereType<Map<String, dynamic>>()
          .map(
            (a) => BudgetAllocation(
              category: a['category'] as String? ?? '',
              percentage: (a['percentage'] as num?) ?? 0,
            ),
          )
          .toList(growable: false),
      version: (json['version'] as num?)?.toInt() ?? 1,
    );
  }
}
