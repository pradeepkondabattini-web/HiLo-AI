import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/venue_search_controller.dart';
import '../../application/venues_providers.dart';
import '../../domain/venue_search.dart';
import '../widgets/venue_card.dart';

/// Venue Discovery (EOS-002-P3-Part-05 §7–10): search controls + ranked results.
/// Searches around Hyderabad by default; device geolocation arrives with Google Maps.
class VenueDiscoveryPage extends ConsumerStatefulWidget {
  const VenueDiscoveryPage({super.key});

  @override
  ConsumerState<VenueDiscoveryPage> createState() => _VenueDiscoveryPageState();
}

class _VenueDiscoveryPageState extends ConsumerState<VenueDiscoveryPage> {
  final _guests = TextEditingController(text: '150');
  final _budget = TextEditingController();
  double _radius = kDefaultRadiusKm;
  bool _verifiedOnly = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _runSearch());
  }

  @override
  void dispose() {
    _guests.dispose();
    _budget.dispose();
    super.dispose();
  }

  void _runSearch() {
    final guests = int.tryParse(_guests.text.trim()) ?? 100;
    final budget = num.tryParse(_budget.text.trim());
    ref.read(venueSearchControllerProvider.notifier).search(
          VenueSearchRequest(
            latitude: kHyderabadLat,
            longitude: kHyderabadLng,
            radiusKm: _radius,
            guestCount: guests <= 0 ? 1 : guests,
            budgetPerPlate: budget,
            filters: VenueFilters(verifiedOnly: _verifiedOnly ? true : null),
          ),
        );
  }

  Future<void> _toggleFavourite(String venueId, bool isFavourite) async {
    final repo = ref.read(venuesRepositoryProvider);
    try {
      if (isFavourite) {
        await repo.removeFavourite(venueId);
      } else {
        await repo.addFavourite(venueId: venueId);
      }
      ref.invalidate(favouriteVenueIdsProvider);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text(venuesErrorMessage(error))));
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(venueSearchControllerProvider, (previous, next) {
      if (next.hasError && !next.isLoading) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(venuesErrorMessage(next.error))));
      }
    });

    final resultsAsync = ref.watch(venueSearchControllerProvider);
    final favourites = ref.watch(favouriteVenueIdsProvider).valueOrNull ?? const <String>{};

    return Scaffold(
      appBar: AppBar(title: const Text('Find venues')),
      body: Column(
        children: <Widget>[
          _SearchControls(
            guests: _guests,
            budget: _budget,
            radius: _radius,
            verifiedOnly: _verifiedOnly,
            onRadiusChanged: (r) => setState(() => _radius = r),
            onVerifiedChanged: (v) => setState(() => _verifiedOnly = v),
            onSearch: _runSearch,
          ),
          const Divider(height: 1),
          Expanded(
            child: resultsAsync.when(
              loading: () => const AppLoadingIndicator(),
              error: (_, __) => const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Text('Could not load venues. Please try again.', textAlign: TextAlign.center),
                ),
              ),
              data: (results) {
                if (results.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text('No venues match. Try a larger radius or fewer filters.'),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: results.length,
                  itemBuilder: (context, i) {
                    final ranked = results[i];
                    final isFav = favourites.contains(ranked.venue.id);
                    return VenueCard(
                      ranked: ranked,
                      isFavourite: isFav,
                      onTap: () => context.push('/venues/${ranked.venue.id}'),
                      onToggleFavourite: () => _toggleFavourite(ranked.venue.id, isFav),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _SearchControls extends StatelessWidget {
  const _SearchControls({
    required this.guests,
    required this.budget,
    required this.radius,
    required this.verifiedOnly,
    required this.onRadiusChanged,
    required this.onVerifiedChanged,
    required this.onSearch,
  });

  final TextEditingController guests;
  final TextEditingController budget;
  final double radius;
  final bool verifiedOnly;
  final ValueChanged<double> onRadiusChanged;
  final ValueChanged<bool> onVerifiedChanged;
  final VoidCallback onSearch;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Expanded(
                child: TextField(
                  controller: guests,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Guests', isDense: true),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: budget,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Budget / plate',
                    prefixText: '₹ ',
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              DropdownButton<double>(
                value: radius,
                onChanged: (r) => onRadiusChanged(r ?? kDefaultRadiusKm),
                items: kAllowedRadiiKm
                    .map((r) => DropdownMenuItem(value: r, child: Text('${r.toInt()} km')))
                    .toList(),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              FilterChip(
                label: const Text('Verified only'),
                selected: verifiedOnly,
                onSelected: onVerifiedChanged,
              ),
              const Spacer(),
              FilledButton.icon(
                onPressed: onSearch,
                icon: const Icon(Icons.search),
                label: const Text('Search'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
