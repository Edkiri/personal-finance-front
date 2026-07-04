export type ExpenseSource = {
  id: number;
  concept: string;
  alias?: string;
};

export type CreateExpenseSourceDto = {
  concept: string;
  alias?: string;
};
