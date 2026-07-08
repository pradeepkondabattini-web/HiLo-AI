import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../application/events_list_controller.dart';
import '../../application/events_providers.dart';
import '../../domain/create_event_input.dart';
import '../../domain/event_category.dart';

/// Create-event wizard (EOS-002-P3-Part-04 §4): type → details → budget → guests →
/// location, submitted to event-service in one call. Designed for a <5-minute flow.
class CreateEventWizardPage extends ConsumerStatefulWidget {
  const CreateEventWizardPage({super.key});

  @override
  ConsumerState<CreateEventWizardPage> createState() => _CreateEventWizardPageState();
}

class _CreateEventWizardPageState extends ConsumerState<CreateEventWizardPage> {
  final _title = TextEditingController();
  final _description = TextEditingController();
  final _budget = TextEditingController();
  final _guests = TextEditingController();
  final _city = TextEditingController(text: 'Hyderabad');

  String? _category;
  DateTime? _date;
  int _step = 0;
  bool _submitting = false;

  static const int _lastStep = 4;

  @override
  void dispose() {
    _title.dispose();
    _description.dispose();
    _budget.dispose();
    _guests.dispose();
    _city.dispose();
    super.dispose();
  }

  String? _validateCurrentStep() {
    switch (_step) {
      case 0:
        if (_category == null) return 'Please choose an event type.';
        if (_title.text.trim().isEmpty) return 'Please enter an event name.';
        return null;
      case 1:
        if (_date == null) return 'Please pick a date.';
        return null;
      case 2:
        final budget = num.tryParse(_budget.text.trim());
        if (budget == null || budget <= 0) return 'Enter a budget greater than 0.';
        return null;
      case 3:
        final guests = int.tryParse(_guests.text.trim());
        if (guests == null || guests <= 0) return 'Enter a guest count greater than 0.';
        return null;
      case 4:
        if (_city.text.trim().isEmpty) return 'Please enter a city.';
        return null;
      default:
        return null;
    }
  }

  void _onContinue() {
    final error = _validateCurrentStep();
    if (error != null) {
      _snack(error);
      return;
    }
    if (_step < _lastStep) {
      setState(() => _step++);
    } else {
      _submit();
    }
  }

  void _onCancel() {
    if (_step > 0) setState(() => _step--);
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _date ?? now.add(const Duration(days: 7)),
      firstDate: now,
      lastDate: DateTime(now.year + 5),
    );
    if (picked != null) setState(() => _date = picked);
  }

  Future<void> _submit() async {
    setState(() => _submitting = true);
    try {
      final input = CreateEventInput(
        title: _title.text.trim(),
        category: _category!,
        eventDate: _date!.toIso8601String(),
        city: _city.text.trim(),
        guestCount: int.parse(_guests.text.trim()),
        totalBudget: num.parse(_budget.text.trim()),
        description: _description.text.trim().isEmpty ? null : _description.text.trim(),
      );
      await ref.read(eventsRepositoryProvider).createEvent(input);
      ref.invalidate(eventsListControllerProvider);
      if (!mounted) return;
      context.pop();
    } catch (error) {
      if (!mounted) return;
      _snack(eventsErrorMessage(error));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _snack(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final dateLabel = _date != null ? DateFormat.yMMMEd().format(_date!) : 'Pick a date';

    return Scaffold(
      appBar: AppBar(title: const Text('Create event')),
      body: Stepper(
        currentStep: _step,
        onStepContinue: _submitting ? null : _onContinue,
        onStepCancel: _submitting ? null : _onCancel,
        onStepTapped: _submitting ? null : (s) => setState(() => _step = s),
        controlsBuilder: (context, details) {
          final isLast = _step == _lastStep;
          return Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Row(
              children: <Widget>[
                FilledButton(
                  onPressed: details.onStepContinue,
                  child: _submitting && isLast
                      ? const SizedBox.square(
                          dimension: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(isLast ? 'Create event' : 'Continue'),
                ),
                if (_step > 0)
                  TextButton(onPressed: details.onStepCancel, child: const Text('Back')),
              ],
            ),
          );
        },
        steps: <Step>[
          Step(
            title: const Text('Type'),
            isActive: _step >= 0,
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: EventCategories.all.map((c) {
                    return ChoiceChip(
                      label: Text(c),
                      selected: _category == c,
                      onSelected: (_) => setState(() => _category = c),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _title,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(labelText: 'Event name'),
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Details'),
            isActive: _step >= 1,
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                OutlinedButton.icon(
                  onPressed: _pickDate,
                  icon: const Icon(Icons.calendar_today_outlined),
                  label: Text(dateLabel),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _description,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Description (optional)',
                  ),
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Budget'),
            isActive: _step >= 2,
            content: TextField(
              controller: _budget,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: 'Total budget',
                prefixText: '₹ ',
                helperText: 'We suggest a Venue/Food/Decor split you can tweak later.',
              ),
            ),
          ),
          Step(
            title: const Text('Guests'),
            isActive: _step >= 3,
            content: TextField(
              controller: _guests,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Expected guests'),
            ),
          ),
          Step(
            title: const Text('Location'),
            isActive: _step >= 4,
            content: TextField(
              controller: _city,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(
                labelText: 'City',
                helperText: 'Venue discovery arrives in a later update.',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
