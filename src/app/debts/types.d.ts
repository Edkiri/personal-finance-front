import { Currency } from '../accounts/hooks/useCurrencies';
import type { ExpenseSource } from '../expenses/types';

export type CreateDebtDto = {
  creditor: string;
  amount: number;
  expenseSourceName: string;
  currencyId: number;
  description?: string;
};

export type CreateDebtPaymentDto = {
  debtId: number;
  amount: number;
  accountId: number;
};

export type DebtWithId = {
  id: number;
  creditor: string;
  amount: number;
  totalPaid: number;
  paid: boolean;
  date: string;
  paidDate: string;
  currency: Currency;
  expenseSource: ExpenseSource;
  description?: string;
};
