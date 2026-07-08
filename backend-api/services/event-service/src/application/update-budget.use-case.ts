import { AppError, touchDocumentMetadata } from '@hilo/backend-shared';
import type { Clock, EventBudgetRepository, EventRepository } from '../domain/ports.js';
import type { EventBudget } from '../domain/event-budget.js';
import { computeAllocations } from '../domain/event-budget.js';
import { canManage } from '../domain/authorization.js';
import { isReadOnly } from '../domain/event-status.js';

export interface UpdateBudgetInput {
  totalAmount?: number;
  contingencyAmount?: number;
  /** New category split; amounts are recomputed from the (new) total. */
  allocations?: { category: string; percentage: number }[];
}

/**
 * Update an event's budget total and/or category allocations (EOS-002-P3-Part-04 §10).
 * Owner/co-host only; archived events are read-only. Amounts are always recomputed from
 * the total and percentages so they stay consistent.
 */
export class UpdateBudgetUseCase {
  constructor(
    private readonly events: EventRepository,
    private readonly budgets: EventBudgetRepository,
    private readonly clock: Clock,
  ) {}

  async execute(actorUid: string, eventId: string, input: UpdateBudgetInput): Promise<EventBudget> {
    const event = await this.events.findById(eventId);
    if (!event || event.deleted) throw AppError.notFound('Event not found');
    if (!canManage(event, actorUid)) {
      throw AppError.forbidden('Only the owner or a co-host can modify the budget');
    }
    if (isReadOnly(event.status)) throw AppError.conflict('Archived events are read-only');
    if (!event.budgetId) throw AppError.notFound('Event budget not found');

    const budget = await this.budgets.findById(event.budgetId);
    if (!budget || budget.deleted) throw AppError.notFound('Event budget not found');

    const totalAmount = input.totalAmount ?? budget.totalAmount;
    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      throw AppError.validation('totalAmount must be zero or greater');
    }
    if (input.contingencyAmount !== undefined && input.contingencyAmount < 0) {
      throw AppError.validation('contingencyAmount must be zero or greater');
    }

    const categories = (input.allocations ?? budget.allocations).map((a) => {
      if (a.percentage < 0 || a.percentage > 100) {
        throw AppError.validation(`allocation percentage out of range for "${a.category}"`);
      }
      return { category: a.category, percentage: a.percentage };
    });

    const patched: EventBudget = {
      ...budget,
      totalAmount,
      contingencyAmount: input.contingencyAmount ?? budget.contingencyAmount,
      allocations: computeAllocations(totalAmount, categories),
    };

    return this.budgets.update(touchDocumentMetadata(patched, actorUid, this.clock.now()));
  }
}
