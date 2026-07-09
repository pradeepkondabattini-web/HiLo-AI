import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/vendor_search_controller.dart';
import '../../application/vendors_providers.dart';
import '../../domain/vendor_models.dart';

/// The caller's quotations (EOS-002-P3-Part-06 §12) — requested (as a consumer) and
/// received (as a business). Accept/decline actions where the state machine allows.
class MyQuotesPage extends ConsumerWidget {
  const MyQuotesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quotesAsync = ref.watch(myQuotesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My quotes')),
      body: quotesAsync.when(
        loading: () => const AppLoadingIndicator(),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(vendorsErrorMessage(error), textAlign: TextAlign.center),
          ),
        ),
        data: (quotes) {
          if (quotes.requested.isEmpty && quotes.received.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text('No quotes yet. Request one from a vendor profile.'),
              ),
            );
          }
          return ListView(
            padding: const EdgeInsets.all(12),
            children: <Widget>[
              if (quotes.requested.isNotEmpty) ...<Widget>[
                Text('Requested by me', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                ...quotes.requested.map((q) => _QuoteTile(quote: q, mine: true)),
                const SizedBox(height: 16),
              ],
              if (quotes.received.isNotEmpty) ...<Widget>[
                Text('Received (my business)', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                ...quotes.received.map((q) => _QuoteTile(quote: q, mine: false)),
              ],
            ],
          );
        },
      ),
    );
  }
}

class _QuoteTile extends ConsumerWidget {
  const _QuoteTile({required this.quote, required this.mine});

  final VendorQuote quote;

  /// True when the caller is the requester (consumer side).
  final bool mine;

  Future<void> _transition(WidgetRef ref, BuildContext context, String status) async {
    try {
      await ref
          .read(vendorsRepositoryProvider)
          .transitionQuote(quoteId: quote.id, status: status);
      ref.invalidate(myQuotesProvider);
    } catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text(vendorsErrorMessage(error))));
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final canAccept = mine && (quote.status == 'submitted' || quote.status == 'negotiating');
    final canDecline = quote.status == 'requested' ||
        quote.status == 'submitted' ||
        quote.status == 'negotiating';

    return Card(
      child: ListTile(
        title: Text(
          quote.proposedAmount != null ? '₹${quote.proposedAmount}' : 'Awaiting proposal',
        ),
        subtitle: Text(
          quote.message?.isNotEmpty == true ? quote.message! : 'Quote ${quote.id.substring(0, 12)}…',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Chip(label: Text(quote.status), visualDensity: VisualDensity.compact),
            if (canAccept)
              IconButton(
                tooltip: 'Accept',
                onPressed: () => _transition(ref, context, 'accepted'),
                icon: const Icon(Icons.check_circle_outline),
              ),
            if (canDecline)
              IconButton(
                tooltip: 'Decline',
                onPressed: () => _transition(ref, context, 'declined'),
                icon: const Icon(Icons.cancel_outlined),
              ),
          ],
        ),
      ),
    );
  }
}
