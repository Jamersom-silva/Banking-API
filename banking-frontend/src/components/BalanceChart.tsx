import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { chartData } from '../mocks/chartData';

export default function BalanceChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-80">
      <h2 className="text-lg font-semibold mb-4">Entradas x Saídas</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="entradas" stroke="#22c55e" />
          <Line type="monotone" dataKey="saidas" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
