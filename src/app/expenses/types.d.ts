import type { AccountWithId } from '../accounts/hooks/useAccounts';
import type { Currency } from '../accounts/hooks/useCurrencies';
import type { ExpenseSource } from '../expense-sources/types';

export type CreateExpenseDto = {
  amount: number;
  accountId: number;
  date: Date;
  expenseSourceName: string;
  description?: string;
};

export type ExpenseWithId = {
  id: number;
  amount: number;
  date: string;
  expenseSource: ExpenseSource;
  description?: string;
  currency: Currency;
  accountId: number;
  account?: AccountWithId;
};

export type ExpenseFilter = {
  dateFrom: Date;
  dateTo: Date;
  accountId: number | null;
  expenseSourceIds: number[];
};

export type UpdateExpensePayload = {
  id: number;
  accountId: number;
  date: Date;
  expenseSourceName: string;
  description: string;
  amount: number;
};
