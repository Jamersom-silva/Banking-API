import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import TransactionsList from '../components/TransactionsList';
import BalanceChart from '../components/BalanceChart';

import { getAccounts, getBalance, getStatement } from '../services/accountService';
import type { BankTransaction } from '../types/Transaction';

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);

  useEffect(() => {
    async function loadData() {
      const accounts = await getAccounts();
      const accountId = accounts[0].id;

      const balance = await getBalance(accountId);
      const statement = await getStatement(accountId);

      setBalance(balance);
      setTransactions(statement);
    }

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Saldo atual" value={`R$ ${balance.toFixed(2)}`} />
        <StatCard title="Entradas" value="—" />
        <StatCard title="Saídas" value="—" />
        <StatCard title="Saldo disponível" value={`R$ ${balance.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <BalanceChart />
        </div>

        <TransactionsList transactions={transactions} />
      </div>
    </DashboardLayout>
  );
}
