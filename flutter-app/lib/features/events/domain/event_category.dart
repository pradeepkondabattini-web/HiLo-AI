/// Common event categories offered in the create-event wizard (EOS-002-P3-Part-04 §3).
/// The backend accepts any category string; this is the curated launch set.
class EventCategories {
  const EventCategories._();

  static const List<String> all = <String>[
    'Birthday',
    'Wedding',
    'Anniversary',
    'Housewarming',
    'Party',
    'Get-together',
    'Reunion',
    'Corporate',
    'Conference',
    'Workshop',
    'Festival',
    'Other',
  ];
}
