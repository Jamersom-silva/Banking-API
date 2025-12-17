import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdraw } from '../services/operationService';

interface Props {
  accountId: string;
}

export default function Withdraw({ accountId }: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await withdraw(accountId, { amount: Number(amount) });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Saque</h1>

      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? 'Processando...' : 'Sacar'}
      </button>
    </form>
  );
}
