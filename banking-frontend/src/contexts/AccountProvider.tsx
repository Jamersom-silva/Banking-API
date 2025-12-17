import { useEffect, useState } from 'react';
import { AccountContext } from './AccountContext';
import { getAccounts } from '../services/accountService';

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function loadAccount() {
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        setAccountId(accounts[0].id);
      }
    }

    loadAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ accountId }}>
      {children}
    </AccountContext.Provider>
  );
}
