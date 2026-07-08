import { describe, it, expect } from 'vitest';
import { computeAllocations } from '../src/domain/event-budget.js';
import { DEFAULT_BUDGET_ALLOCATIONS } from '../src/domain/budget-defaults.js';

describe('budget defaults', () => {
  it('default allocations sum to 100%', () => {
    const total = DEFAULT_BUDGET_ALLOCATIONS.reduce((s, a) => s + a.percentage, 0);
    expect(total).toBe(100);
  });
});

describe('computeAllocations', () => {
  it('derives amounts from the total and percentages', () => {
    const result = computeAllocations(100_000, DEFAULT_BUDGET_ALLOCATIONS);
    const venue = result.find((a) => a.category === 'venue');
    const food = result.find((a) => a.category === 'food');
    expect(venue).toMatchObject({ percentage: 40, amount: 40_000 });
    expect(food).toMatchObject({ percentage: 30, amount: 30_000 });
    const sum = result.reduce((s, a) => s + a.amount, 0);
    expect(sum).toBe(100_000);
  });

  it('rounds amounts to two decimals', () => {
    const result = computeAllocations(33.33, [{ category: 'x', percentage: 33 }]);
    expect(result[0]!.amount).toBe(11);
  });
});
