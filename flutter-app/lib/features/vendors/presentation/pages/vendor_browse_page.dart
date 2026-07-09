import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/vendor_search_controller.dart';
import '../../application/vendors_providers.dart';
import '../../domain/vendor.dart';
import '../../domain/vendor_models.dart';
import '../widgets/vendor_card.dart';

/// Vendor Marketplace browse (EOS-002-P3-Part-06 §4): category chips + ranked results.
/// Searches around Hyderabad by default (geolocation arrives with Google Maps).
class VendorBrowsePage extends ConsumerStatefulWidget {
  const VendorBrowsePage({super.key});

  @override
  ConsumerState<VendorBrowsePage> createState() => _VendorBrowsePageState();
}

class _VendorBrowsePageState extends ConsumerState<VendorBrowsePage> {
  static const double _hydLat = 17.385;
  static const double _hydLng = 78.4867;

  String? _category;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _runSearch());
  }

  void _runSearch() {
    ref.read(vendorSearchControllerProvider.notifier).search(
          VendorSearchRequest(
            latitude: _hydLat,
            longitude: _hydLng,
            radiusKm: 20,
            category: _category,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(vendorSearchControllerProvider, (previous, next) {
      if (next.hasError && !next.isLoading) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(vendorsErrorMessage(next.error))));
      }
    });

    final resultsAsync = ref.watch(vendorSearchControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Find vendors'),
        actions: <Widget>[
          IconButton(
            tooltip: 'My quotes',
            onPressed: () => context.push('/vendors/quotes'),
            icon: const Icon(Icons.request_quote_outlined),
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          SizedBox(
            height: 56,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: const Text('All'),
                    selected: _category == null,
                    onSelected: (_) {
                      setState(() => _category = null);
                      _runSearch();
                    },
                  ),
                ),
                ...kVendorCategories.map(
                  (c) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(c),
                      selected: _category == c,
                      onSelected: (_) {
                        setState(() => _category = c);
                        _runSearch();
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: resultsAsync.when(
              loading: () => const AppLoadingIndicator(),
              error: (_, __) => const Center(
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Text('Could not load vendors. Please try again.'),
                ),
              ),
              data: (results) {
                if (results.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text('No vendors in this category yet. Try another one.'),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: results.length,
                  itemBuilder: (context, i) {
                    final ranked = results[i];
                    return VendorCard(
                      ranked: ranked,
                      onTap: () => context.push('/vendors/${ranked.vendor.id}'),
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
