import type { AccountWithId } from '../accounts/hooks/useAccounts';
import type { Currency } from '../accounts/hooks/useCurrencies';

export type IncomesQueryParams = {
  accountId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  incomeSourceIds: number[];
};

export type IncomeSource = {
  id: number;
  name: string;
  description?: string;
};

export type IncomeWithId = {
  id: number;
  amount: number;
  date: string;
  incomeSource: IncomeSource;
  description?: string;
  currency: Currency;
  accountId: number;
  account: AccountWithId;
};
