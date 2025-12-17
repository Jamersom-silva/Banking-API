import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import TransactionsList from '../components/TransactionsList';
import BalanceChart from '../components/BalanceChart';

import { getBalance, getStatement } from '../services/accountService';
import { useAccount } from '../hooks/useAccount';
import { useLoading } from '../hooks/useLoading';

import type { BankTransaction } from '../types/Transaction';

export default function Dashboard() {
  const { accountId } = useAccount();
  const { startLoading, stopLoading } = useLoading();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);

 useEffect(() => {
  if (!accountId) return;

  const id = accountId; // <- agora é string garantida

  async function loadData() {
    startLoading();

    try {
      const balance = await getBalance(id);
      const statement = await getStatement(id);

      setBalance(balance);
      setTransactions(statement);
    } finally {
      stopLoading();
    }
  }

  loadData();
}, [accountId, startLoading, stopLoading]);

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
