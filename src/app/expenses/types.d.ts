import { Currency } from '../accounts/hooks/useCurrencies';

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
};

export type ExpenseFilter = {
  dateFrom: Date;
  dateTo: Date;
  accountId: number | null;
  expenseSourceIds: number[];
};
