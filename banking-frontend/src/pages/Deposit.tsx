import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposit } from '../services/operationService';
import { getAccounts } from '../services/accountService';

export default function Deposit() {
  const [accountId, setAccountId] = useState<string | null>(null);
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

    await deposit(accountId, { amount: Number(amount) });
    navigate('/');
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

      <button>Depositar</button>
    </form>
  );
}
