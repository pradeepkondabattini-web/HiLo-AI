/// Input for creating an event (EOS-002-P3-Part-04 §4–5). Matches the event-service
/// `POST /events` body.
class CreateEventInput {
  const CreateEventInput({
    required this.title,
    required this.category,
    required this.eventDate,
    required this.city,
    required this.guestCount,
    required this.totalBudget,
    this.startTime,
    this.endTime,
    this.description,
    this.dressCode,
    this.tags,
    this.notes,
  });

  final String title;
  final String category;
  final String eventDate;
  final String? startTime;
  final String? endTime;
  final String city;
  final int guestCount;
  final num totalBudget;
  final String? description;
  final String? dressCode;
  final List<String>? tags;
  final String? notes;

  Map<String, dynamic> toJson() => <String, dynamic>{
    'title': title,
    'category': category,
    'eventDate': eventDate,
    if (startTime != null) 'startTime': startTime,
    if (endTime != null) 'endTime': endTime,
    'city': city,
    'guestCount': guestCount,
    'totalBudget': totalBudget,
    if (description != null) 'description': description,
    if (dressCode != null) 'dressCode': dressCode,
    if (tags != null) 'tags': tags,
    if (notes != null) 'notes': notes,
  };
}
