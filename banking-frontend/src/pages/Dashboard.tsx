import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { dashboardData } from '../mocks/data'; // Importando os dados

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
    </DashboardLayout>
  );
}
