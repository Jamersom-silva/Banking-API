import { Transaction } from '../types/Transaction';

interface Props {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <ul>
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="flex justify-between items-center border-b py-2 last:border-b-0"
          >
            <span className="text-gray-600">{tx.type}</span>

            <span
              className={
                tx.type === 'DEPOSIT'
                  ? 'text-green-500 font-medium'
                  : 'text-red-500 font-medium'
              }
            >
              R$ {tx.amount.toFixed(2)}
            </span>

            <span className="text-gray-400 text-sm">{tx.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
