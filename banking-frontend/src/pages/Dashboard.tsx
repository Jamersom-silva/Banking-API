import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { dashboardData } from '../mocks/data'; // Importando os dados
import { transactionsData } from '../mocks/data'; // Importando os dados de transações

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

      <h2 className="text-xl font-semibold mb-4">Extrato</h2>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <ul>
          {transactionsData.map((tx) => (
            <li key={tx.id} className="flex justify-between border-b py-2">
              <span className="text-gray-600">{tx.type}</span>
              <span className={tx.type === "DEPOSIT" ? "text-green-500" : "text-red-500"}>
                R$ {tx.amount.toFixed(2)}
              </span>
              <span className="text-gray-400">{tx.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
