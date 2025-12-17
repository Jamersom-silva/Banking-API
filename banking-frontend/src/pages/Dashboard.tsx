import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Saldo atual" value="R$ 1.250,00" />
        <StatCard title="Entradas" value="R$ 3.200,00" />
        <StatCard title="Saídas" value="R$ 1.950,00" />
        <StatCard title="Saldo disponível" value="R$ 1.250,00" />
      </div>
    </DashboardLayout>
  );
}
