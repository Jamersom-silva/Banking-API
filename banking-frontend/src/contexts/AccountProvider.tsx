import { useEffect, useState } from 'react';
import { getAccounts } from '../services/accountService';
import { AccountContext } from './AccountContext';

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccount() {
      const accounts = await getAccounts();
      setAccountId(accounts[0].id);
    }

    loadAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ accountId }}>
      {children}
    </AccountContext.Provider>
  );
}
