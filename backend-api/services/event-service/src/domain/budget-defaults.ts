/**
 * Default budget allocation percentages (EOS-002-P3-Part-04 §10). Configurable master
 * data — applied when an event budget is first created, then fully editable by the owner.
 * Percentages sum to 100.
 */
export interface BudgetCategoryDefault {
  category: string;
  percentage: number;
}

export const DEFAULT_BUDGET_ALLOCATIONS: readonly BudgetCategoryDefault[] = [
  { category: 'venue', percentage: 40 },
  { category: 'food', percentage: 30 },
  { category: 'decoration', percentage: 10 },
  { category: 'photography', percentage: 8 },
  { category: 'entertainment', percentage: 5 },
  { category: 'invitations', percentage: 2 },
  { category: 'miscellaneous', percentage: 5 },
];

/** Default currency for the launch market (Hyderabad, India). */
export const DEFAULT_CURRENCY = 'INR';
