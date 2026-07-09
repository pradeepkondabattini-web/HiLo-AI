import 'package:flutter/material.dart';

import '../../domain/vendor_models.dart';

/// A ranked vendor card (EOS-002-P3-Part-06 §7): rating, distance, price, verification
/// badge, and the Intelligence Score as a "% match".
class VendorCard extends StatelessWidget {
  const VendorCard({super.key, required this.ranked, this.onTap});

  final RankedVendor ranked;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final v = ranked.vendor;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                children: <Widget>[
                  Expanded(
                    child: Text(
                      v.businessName,
                      style: theme.textTheme.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (v.verificationLevel >= 3)
                    Tooltip(
                      message: v.verificationLabel,
                      child: Icon(
                        Icons.verified,
                        size: 20,
                        color: v.verificationLevel == 4
                            ? theme.colorScheme.primary
                            : theme.colorScheme.tertiary,
                      ),
                    ),
                ],
              ),
              Text(
                '${v.category} · ${v.city}',
                style: theme.textTheme.bodySmall
                    ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 4,
                children: <Widget>[
                  _Meta(icon: Icons.star_outline, text: v.rating.toStringAsFixed(1)),
                  _Meta(
                    icon: Icons.place_outlined,
                    text: '${ranked.distanceKm.toStringAsFixed(1)} km',
                  ),
                  if (v.startingPrice != null)
                    _Meta(icon: Icons.payments_outlined, text: 'from ₹${v.startingPrice}'),
                  if (v.yearsOfExperience != null)
                    _Meta(icon: Icons.workspace_premium_outlined, text: '${v.yearsOfExperience} yrs'),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: <Widget>[
                  Expanded(
                    child: LinearProgressIndicator(
                      value: ranked.score.clamp(0, 1),
                      minHeight: 6,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${(ranked.score * 100).round()}% match',
                    style: theme.textTheme.labelSmall,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Meta extends StatelessWidget {
  const _Meta({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Icon(icon, size: 16),
        const SizedBox(width: 4),
        Text(text, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}
