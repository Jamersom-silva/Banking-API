import { createContext } from 'react';

interface AccountContextData {
  accountId: string | null;
}

export const AccountContext =
  createContext<AccountContextData | undefined>(undefined);
