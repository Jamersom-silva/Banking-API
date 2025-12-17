import { createContext } from 'react';

export interface AccountContextData {
  accountId: string | null;
}

export const AccountContext = createContext<AccountContextData | undefined>(
  undefined
);
