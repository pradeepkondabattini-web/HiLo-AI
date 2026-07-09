/// A marketplace vendor (mirrors vendor-service `VendorDto`). EOS-002-P3-Part-06.
class Vendor {
  const Vendor({
    required this.id,
    required this.businessName,
    required this.category,
    required this.city,
    required this.latitude,
    required this.longitude,
    required this.serviceRadiusKm,
    required this.rating,
    required this.verificationLevel,
    required this.portfolio,
    this.description,
    this.address,
    this.yearsOfExperience,
    this.teamSize,
    this.startingPrice,
    this.reviewCount,
    this.trustScore,
    this.responseTimeHours,
    this.workingDays,
  });

  final String id;
  final String businessName;
  final String category;
  final String? description;
  final String city;
  final String? address;
  final double latitude;
  final double longitude;
  final double serviceRadiusKm;
  final int? yearsOfExperience;
  final int? teamSize;
  final num? startingPrice;
  final double rating;
  final int? reviewCount;

  /// 0–4 (EOS-002-P3-Part-06 §6). 4 = HiLo Verified Partner.
  final int verificationLevel;
  final double? trustScore;
  final double? responseTimeHours;
  final List<String> portfolio;
  final List<String>? workingDays;

  String get verificationLabel => switch (verificationLevel) {
    4 => 'HiLo Verified Partner',
    3 => 'Documents verified',
    2 => 'Mobile verified',
    1 => 'Email verified',
    _ => 'Unverified',
  };
}

/// Curated launch categories (kept in sync with vendor-service).
const List<String> kVendorCategories = <String>[
  'Catering',
  'Decoration',
  'Photography',
  'Videography',
  'Entertainment',
  'Music',
  'Beauty',
  'Event Services',
  'Transportation',
  'Gifts',
];
