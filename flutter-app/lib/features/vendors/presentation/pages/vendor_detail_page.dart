import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/widgets/app_loading_indicator.dart';
import '../../application/vendor_search_controller.dart';
import '../../application/vendors_providers.dart';
import '../../domain/vendor.dart';

/// Vendor profile + request-a-quote (EOS-002-P3-Part-06 §7, §12).
class VendorDetailPage extends ConsumerStatefulWidget {
  const VendorDetailPage({super.key, required this.vendorId});

  final String vendorId;

  @override
  ConsumerState<VendorDetailPage> createState() => _VendorDetailPageState();
}

class _VendorDetailPageState extends ConsumerState<VendorDetailPage> {
  bool _requesting = false;

  Future<void> _requestQuote() async {
    final message = await showDialog<String>(
      context: context,
      builder: (context) => const _QuoteMessageDialog(),
    );
    if (message == null) return; // cancelled

    setState(() => _requesting = true);
    try {
      await ref.read(vendorsRepositoryProvider).requestQuote(
            vendorId: widget.vendorId,
            message: message.isEmpty ? null : message,
          );
      ref.invalidate(myQuotesProvider);
      if (!mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(content: Text('Quote requested — the vendor will respond soon.')),
        );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text(vendorsErrorMessage(error))));
    } finally {
      if (mounted) setState(() => _requesting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final vendorAsync = ref.watch(vendorDetailProvider(widget.vendorId));

    return Scaffold(
      appBar: AppBar(title: Text(vendorAsync.valueOrNull?.businessName ?? 'Vendor')),
      bottomNavigationBar: vendorAsync.hasValue
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: FilledButton.icon(
                  onPressed: _requesting ? null : _requestQuote,
                  icon: const Icon(Icons.request_quote_outlined),
                  label: Text(_requesting ? 'Requesting…' : 'Request a quote'),
                ),
              ),
            )
          : null,
      body: vendorAsync.when(
        loading: () => const AppLoadingIndicator(),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(vendorsErrorMessage(error), textAlign: TextAlign.center),
          ),
        ),
        data: (vendor) => _Detail(vendor: vendor),
      ),
    );
  }
}

class _QuoteMessageDialog extends StatefulWidget {
  const _QuoteMessageDialog();

  @override
  State<_QuoteMessageDialog> createState() => _QuoteMessageDialogState();
}

class _QuoteMessageDialogState extends State<_QuoteMessageDialog> {
  final _message = TextEditingController();

  @override
  void dispose() {
    _message.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Request a quote'),
      content: TextField(
        controller: _message,
        maxLines: 3,
        decoration: const InputDecoration(
          labelText: 'Tell the vendor about your event (optional)',
          hintText: 'e.g. Wedding for 300 guests on 12 Dec',
        ),
      ),
      actions: <Widget>[
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(
          onPressed: () => Navigator.pop(context, _message.text.trim()),
          child: const Text('Send request'),
        ),
      ],
    );
  }
}

class _Detail extends StatelessWidget {
  const _Detail({required this.vendor});
  final Vendor vendor;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: <Widget>[
        Text(vendor.businessName, style: theme.textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(
          '${vendor.category} · ${vendor.city}',
          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: <Widget>[
            Chip(
              avatar: const Icon(Icons.star, size: 18),
              label: Text(vendor.rating.toStringAsFixed(1)),
            ),
            Chip(
              avatar: Icon(
                vendor.verificationLevel >= 3 ? Icons.verified : Icons.shield_outlined,
                size: 18,
              ),
              label: Text(vendor.verificationLabel),
            ),
            if (vendor.startingPrice != null)
              Chip(
                avatar: const Icon(Icons.payments, size: 18),
                label: Text('from ₹${vendor.startingPrice}'),
              ),
            if (vendor.yearsOfExperience != null)
              Chip(
                avatar: const Icon(Icons.workspace_premium, size: 18),
                label: Text('${vendor.yearsOfExperience} years'),
              ),
          ],
        ),
        if ((vendor.description ?? '').isNotEmpty) ...<Widget>[
          const SizedBox(height: 16),
          Text('About', style: theme.textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(vendor.description!),
        ],
        if (vendor.trustScore != null) ...<Widget>[
          const SizedBox(height: 16),
          Text('HiLo Trust Score', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Row(
            children: <Widget>[
              Expanded(
                child: LinearProgressIndicator(
                  value: vendor.trustScore!.clamp(0, 1),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 8),
              Text('${(vendor.trustScore! * 100).round()}%'),
            ],
          ),
        ],
        const SizedBox(height: 80), // clearance above the bottom CTA
      ],
    );
  }
}
