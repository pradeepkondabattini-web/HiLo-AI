/// A single budget allocation line (e.g. Venue 40%). EOS-002-P3-Part-04 §10.
class BudgetAllocation {
  const BudgetAllocation({required this.category, required this.percentage});
  final String category;
  final num percentage;
}

/// Event budget (mirrors event-service `BudgetDto`).
class EventBudget {
  const EventBudget({
    required this.id,
    required this.eventId,
    required this.currency,
    required this.totalAmount,
    required this.contingencyAmount,
    required this.allocations,
    required this.version,
  });

  final String id;
  final String eventId;
  final String currency;
  final num totalAmount;
  final num contingencyAmount;
  final List<BudgetAllocation> allocations;
  final int version;
}
