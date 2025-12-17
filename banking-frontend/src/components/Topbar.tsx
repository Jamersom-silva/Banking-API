import { useAuth } from '../hooks/useAuth';

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold text-slate-800">
        Dashboard
      </h1>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Sair
      </button>
    </header>
  );
}
