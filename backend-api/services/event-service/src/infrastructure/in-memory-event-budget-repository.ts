import { AppError } from '@hilo/backend-shared';
import type { EventBudgetRepository } from '../domain/ports.js';
import type { EventBudget } from '../domain/event-budget.js';

/** In-memory {@link EventBudgetRepository} for tests and local development. */
export class InMemoryEventBudgetRepository implements EventBudgetRepository {
  private readonly store = new Map<string, EventBudget>();

  async findById(id: string): Promise<EventBudget | null> {
    const found = this.store.get(id);
    return found ? structuredClone(found) : null;
  }

  async findByEventId(eventId: string): Promise<EventBudget | null> {
    for (const budget of this.store.values()) {
      if (budget.eventId === eventId && !budget.deleted) return structuredClone(budget);
    }
    return null;
  }

  async create(budget: EventBudget): Promise<EventBudget> {
    if (this.store.has(budget.id)) {
      throw AppError.conflict(`Budget already exists: ${budget.id}`);
    }
    this.store.set(budget.id, structuredClone(budget));
    return structuredClone(budget);
  }

  async update(budget: EventBudget): Promise<EventBudget> {
    this.store.set(budget.id, structuredClone(budget));
    return structuredClone(budget);
  }
}
