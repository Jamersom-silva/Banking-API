import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import TransactionsList from '../components/TransactionsList';
import { dashboardData, transactionsData } from '../mocks/data';
import BalanceChart from '../components/BalanceChart';


export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Saldo atual" value={`R$ ${dashboardData.balance.toFixed(2)}`} />
        <StatCard title="Entradas" value={`R$ ${dashboardData.deposits.toFixed(2)}`} />
        <StatCard title="Saídas" value={`R$ ${dashboardData.withdrawals.toFixed(2)}`} />
        <StatCard title="Saldo disponível" value={`R$ ${dashboardData.availableBalance.toFixed(2)}`} />
      </div>

    <div className="grid grid-cols-3 gap-6 mb-8">
  <div className="col-span-2">
    <BalanceChart />
  </div>

  <div>
    <h2 className="text-xl font-semibold mb-4">Extrato</h2>
    <TransactionsList transactions={transactionsData} />
  </div>
</div>


      <h2 className="text-xl font-semibold mb-4">Extrato</h2>

      <TransactionsList transactions={transactionsData} />
    </DashboardLayout>
  );
}
