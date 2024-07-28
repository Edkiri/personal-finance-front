export type ExpenseSource = {
  id: number;
  name: string;
  description?: string;
};

export type CreateExpenseSourceDto = {
  name: string;
  description?: string;
};
