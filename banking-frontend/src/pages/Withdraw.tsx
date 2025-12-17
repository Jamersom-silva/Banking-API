import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdraw } from '../services/operationService';
import { getAccounts } from '../services/accountService';

export default function Withdraw() {
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

    await withdraw(accountId, { amount: Number(amount) });
    navigate('/');
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

      <button>Sacar</button>
    </form>
  );
}
