import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transfer } from '../services/operationService';

interface Props {
  accountId: string;
}

export default function Transfer({ accountId }: Props) {
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await transfer(accountId, {
        toAccountId,
        amount: Number(amount),
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Transferência</h1>

      <input
        placeholder="ID da conta destino"
        value={toAccountId}
        onChange={(e) => setToAccountId(e.target.value)}
      />

      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? 'Processando...' : 'Transferir'}
      </button>
    </form>
  );
}
