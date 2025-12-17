import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposit } from '../services/operationService';
import { getAccounts } from '../services/accountService';
import Toast from '../components/Toast';

export default function Deposit() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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

    setLoading(true);

    try {
      await deposit(accountId, { amount: Number(amount) });
      setToast({ message: 'Depósito realizado com sucesso!', type: 'success' });

      setTimeout(() => navigate('/'), 1000);
    } catch {
      setToast({ message: 'Erro ao realizar depósito', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

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
    </>
  );
}
