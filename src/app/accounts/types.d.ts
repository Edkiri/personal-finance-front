export type Account = {
  temporaryId: string;
  name: string;
  amount: string | number;
  bank: string;
  currencyId: string;
  isDefault?: boolean;
};

export type Currency = {
  id: number;
  name: string;
  symbol: string;
};

export type AccountWithId = Omit<Omit<Account, 'amount'>, 'temporaryId'> & {
  id: number;
  amount: number;
  currency: Currency;
  currencyId: number;
};
