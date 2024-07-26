import type { AccountWithId } from '../accounts/hooks/useAccounts';
import type { Currency } from '../accounts/hooks/useCurrencies';

export type CreateExpenseDto = {
  amount: number;
  accountId: number;
  date: Date;
  expenseSourceName: string;
  description?: string;
};

export type ExpenseSource = {
  id: number;
  name: string;
  description?: string;
};

export type ExpenseWithId = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
  currency: Currency;
  account?: AccountWithId;
};

export type ExpenseFilter = {
  dateFrom: Date;
  dateTo: Date;
  accountId: number | null;
  expenseSourceIds: number[];
};
