import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposit } from '../services/operationService';

interface Props {
  accountId: string;
}

export default function Deposit({ accountId }: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await deposit(accountId, { amount: Number(amount) });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Depósito</h1>

      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? 'Processando...' : 'Depositar'}
      </button>
    </form>
  );
}
