import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transfer } from '../services/operationService';
import { getAccounts } from '../services/accountService';
import Toast from '../components/Toast';

export default function Transfer() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [toAccountId, setToAccountId] = useState('');
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
    setToast(null);

    try {
      await transfer(accountId, {
        toAccountId,
        amount: Number(amount),
      });

      setToast({
        message: 'Transferência realizada com sucesso!',
        type: 'success',
      });

      setTimeout(() => navigate('/'), 1000);
    } catch {
      setToast({ message: 'Erro ao realizar transferência', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Transferência</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ID da conta destino"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
          />

          <input
            type="number"
            min="1"
            placeholder="Valor da transferência"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition"
          >
            {loading ? 'Processando...' : 'Transferir'}
          </button>
        </form>
      </div>
    </>
  );
}
