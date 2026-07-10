import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../application/ai_providers.dart';
import '../../domain/ai_models.dart';

/// Conversational planning assistant (EOS-002-P3-Part-07). Every assistant turn
/// shows its explanation (intent + data sources) — visible AI, never a black box.
class AiChatPage extends ConsumerStatefulWidget {
  const AiChatPage({super.key, this.eventId});

  /// When opened from an event workspace, grounds readiness/answers in that event.
  final String? eventId;

  @override
  ConsumerState<AiChatPage> createState() => _AiChatPageState();
}

class _AiChatPageState extends ConsumerState<AiChatPage> {
  final TextEditingController _input = TextEditingController();
  final ScrollController _scroll = ScrollController();

  static const List<String> _suggestions = <String>[
    'Find me a venue',
    'I need a caterer',
    'Split a budget of ₹2,00,000',
    'Give me a wedding checklist',
    'Show my events',
  ];

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send([String? preset]) async {
    final text = preset ?? _input.text;
    _input.clear();
    await ref.read(aiChatControllerProvider.notifier).send(text, eventId: widget.eventId);
    if (!mounted) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(aiChatControllerProvider);
    ref.listen(aiChatControllerProvider, (previous, next) {
      if (next.error != null && next.error != previous?.error) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(next.error!)));
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('HiLo Assistant')),
      body: Column(
        children: <Widget>[
          Expanded(
            child: state.messages.isEmpty
                ? _EmptyState(suggestions: _suggestions, onTap: (s) => _send(s))
                : ListView.builder(
                    controller: _scroll,
                    padding: const EdgeInsets.all(12),
                    itemCount: state.messages.length + (state.sending ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == state.messages.length) {
                        return const _TypingIndicator();
                      }
                      return _MessageBubble(message: state.messages[index]);
                    },
                  ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: TextField(
                      controller: _input,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _send(),
                      decoration: const InputDecoration(
                        hintText: 'Ask about venues, vendors, budgets…',
                        border: OutlineInputBorder(),
                        isDense: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: state.sending ? null : _send,
                    icon: const Icon(Icons.send),
                    tooltip: 'Send',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.suggestions, required this.onTap});

  final List<String> suggestions;
  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(Icons.auto_awesome, size: 48, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 12),
            Text('Plan your event with HiLo', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            const Text(
              'I can find venues and vendors, split budgets, build checklists, '
              'and check how ready your event is.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: suggestions
                  .map((s) => ActionChip(label: Text(s), onPressed: () => onTap(s)))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();

  @override
  Widget build(BuildContext context) {
    return const Align(
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message});

  final AiChatMessage message;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isUser = message.isUser;
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        decoration: BoxDecoration(
          color: isUser ? scheme.primaryContainer : scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(message.content),
            ..._structuredCards(context),
            if (message.explanation != null) _ExplanationRow(explanation: message.explanation!),
          ],
        ),
      ),
    );
  }

  /// Render well-known skill outputs natively (checklists, budget splits, readiness).
  List<Widget> _structuredCards(BuildContext context) {
    final widgets = <Widget>[];

    final checklist = message.data['skill.generate_checklist'];
    if (checklist is Map<String, dynamic> && checklist['items'] is List) {
      final items = (checklist['items'] as List).whereType<String>();
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: items
                .map(
                  (item) => Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      const Text('•  '),
                      Expanded(child: Text(item)),
                    ],
                  ),
                )
                .toList(),
          ),
        ),
      );
    }

    final budget = message.data['skill.budget_allocation'];
    if (budget is Map<String, dynamic> && budget['allocations'] is List) {
      final rows = (budget['allocations'] as List).whereType<Map<String, dynamic>>();
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: rows.map((a) {
              final amount = a['amount'];
              return Text(
                '${a['category']}: ${a['percentage']}%'
                '${amount is num ? '  (₹${amount.toStringAsFixed(0)})' : ''}',
              );
            }).toList(),
          ),
        ),
      );
    }

    final readiness = message.data['skill.readiness_score'];
    if (readiness is Map<String, dynamic> && readiness['score'] is num) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(
            'Readiness: ${readiness['score']}/100',
            style: Theme.of(context).textTheme.titleSmall,
          ),
        ),
      );
    }

    return widgets;
  }
}

class _ExplanationRow extends StatelessWidget {
  const _ExplanationRow({required this.explanation});

  final AiExplanation explanation;

  @override
  Widget build(BuildContext context) {
    final style = Theme.of(context).textTheme.labelSmall;
    final sources = explanation.dataSources.isEmpty
        ? 'general guidance'
        : explanation.dataSources.join(' · ');
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Text('${explanation.intent.replaceAll('_', ' ')} · $sources', style: style),
    );
  }
}
