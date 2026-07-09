import 'package:flutter/material.dart';

import '../../domain/ranked_venue.dart';

/// A ranked venue card for the discovery list (EOS-002-P3-Part-05 §10).
class VenueCard extends StatelessWidget {
  const VenueCard({
    super.key,
    required this.ranked,
    required this.isFavourite,
    this.onTap,
    this.onToggleFavourite,
  });

  final RankedVenue ranked;
  final bool isFavourite;
  final VoidCallback? onTap;
  final VoidCallback? onToggleFavourite;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final v = ranked.venue;
    final price = v.pricePerPlate != null
        ? '₹${v.pricePerPlate}/plate'
        : (v.priceLevel != null ? '₹' * v.priceLevel! : '—');

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
                      v.name,
                      style: theme.textTheme.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    tooltip: isFavourite ? 'Remove favourite' : 'Save favourite',
                    onPressed: onToggleFavourite,
                    icon: Icon(
                      isFavourite ? Icons.favorite : Icons.favorite_border,
                      color: isFavourite ? theme.colorScheme.error : null,
                    ),
                  ),
                ],
              ),
              Text(
                '${v.category ?? 'Venue'}${v.city != null ? ' · ${v.city}' : ''}',
                style: theme.textTheme.bodySmall
                    ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 4,
                children: <Widget>[
                  _Meta(icon: Icons.place_outlined, text: '${ranked.distanceKm.toStringAsFixed(1)} km'),
                  _Meta(icon: Icons.star_outline, text: v.rating.toStringAsFixed(1)),
                  _Meta(icon: Icons.group_outlined, text: '${v.capacity}'),
                  _Meta(icon: Icons.payments_outlined, text: price),
                  if (v.verified)
                    const _Meta(icon: Icons.verified_outlined, text: 'Verified'),
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
                  Text('${(ranked.score * 100).round()}% match', style: theme.textTheme.labelSmall),
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
