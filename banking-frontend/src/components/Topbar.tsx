import { useAuth } from '../hooks/useAuth';

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Bem-vindo</h2>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Sair
      </button>
    </header>
  );
}
