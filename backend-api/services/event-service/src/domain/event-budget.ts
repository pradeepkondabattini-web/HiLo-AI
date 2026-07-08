import type { DocumentMetadata } from '@hilo/backend-shared';

/** A single budget line derived from a category percentage (EOS-002-P3-Part-04 §10). */
export interface BudgetAllocation {
  category: string;
  percentage: number;
  amount: number;
}

/** An event budget in `event_budgets/` (owner: event-service). */
export interface EventBudget extends DocumentMetadata {
  eventId: string;
  currency: string;
  totalAmount: number;
  contingencyAmount?: number;
  allocations: BudgetAllocation[];
}

/** Compute allocation amounts from a total and a list of category percentages. */
export function computeAllocations(
  totalAmount: number,
  categories: readonly { category: string; percentage: number }[],
): BudgetAllocation[] {
  return categories.map((c) => ({
    category: c.category,
    percentage: c.percentage,
    // Round to 2 decimals to avoid floating-point noise in currency amounts.
    amount: Math.round(((totalAmount * c.percentage) / 100) * 100) / 100,
  }));
}
