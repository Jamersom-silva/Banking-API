import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transfer } from '../services/operationService';
import { getAccounts } from '../services/accountService';

export default function Transfer() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAccount() {
      const accounts = await getAccounts();
      setAccountId(accounts[0].id);
    }

    loadAccount();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return;

    await transfer(accountId, {
      toAccountId,
      amount: Number(amount),
    });

    navigate('/');
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

      <button>Transferir</button>
    </form>
  );
}
