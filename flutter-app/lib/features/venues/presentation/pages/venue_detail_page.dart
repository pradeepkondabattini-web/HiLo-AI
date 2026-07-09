import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/venue_search_controller.dart';
import '../../application/venues_providers.dart';
import '../../domain/venue.dart';

/// Venue details (EOS-002-P3-Part-05 §11). The interactive map arrives with Google Maps.
class VenueDetailPage extends ConsumerWidget {
  const VenueDetailPage({super.key, required this.venueId});

  final String venueId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final venueAsync = ref.watch(venueDetailProvider(venueId));

    return Scaffold(
      appBar: AppBar(title: Text(venueAsync.valueOrNull?.name ?? 'Venue')),
      body: venueAsync.when(
        loading: () => const AppLoadingIndicator(),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(venuesErrorMessage(error), textAlign: TextAlign.center),
          ),
        ),
        data: (venue) => _Detail(venue: venue),
      ),
    );
  }
}

class _Detail extends StatelessWidget {
  const _Detail({required this.venue});
  final Venue venue;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final price = venue.pricePerPlate != null
        ? '₹${venue.pricePerPlate} per plate'
        : (venue.priceLevel != null ? 'Price level ${venue.priceLevel}' : 'Price on request');

    return ListView(
      padding: const EdgeInsets.all(16),
      children: <Widget>[
        Text(venue.name, style: theme.textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(
          '${venue.category ?? 'Venue'}${venue.city != null ? ' · ${venue.city}' : ''}',
          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: <Widget>[
            Chip(avatar: const Icon(Icons.star, size: 18), label: Text(venue.rating.toStringAsFixed(1))),
            Chip(avatar: const Icon(Icons.group, size: 18), label: Text('${venue.capacity} guests')),
            Chip(avatar: const Icon(Icons.payments, size: 18), label: Text(price)),
            if (venue.verified)
              const Chip(avatar: Icon(Icons.verified, size: 18), label: Text('Verified')),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: <Widget>[
            const Icon(Icons.location_on_outlined, size: 20),
            const SizedBox(width: 12),
            Expanded(child: Text(venue.address)),
          ],
        ),
        if (venue.amenities.isNotEmpty) ...<Widget>[
          const SizedBox(height: 16),
          Text('Amenities', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: venue.amenities.map((a) => Chip(label: Text(a))).toList(),
          ),
        ],
        const SizedBox(height: 16),
        Card(
          child: SizedBox(
            height: 160,
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Icon(Icons.map_outlined, size: 40, color: theme.colorScheme.primary),
                  const SizedBox(height: 8),
                  const Text('Interactive map arrives with Google Maps'),
                  const SizedBox(height: 4),
                  Text(
                    '${venue.latitude.toStringAsFixed(4)}, ${venue.longitude.toStringAsFixed(4)}',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
