import { useAuth } from '../hooks/useAuth';


export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Banking</h1>

      <nav className="space-y-4 flex-1">
        <a className="block text-slate-300 hover:text-white">Dashboard</a>
        <a className="block text-slate-300 hover:text-white">Transferências</a>
        <a className="block text-slate-300 hover:text-white">Extrato</a>
      </nav>

      <button
        onClick={logout}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Sair
      </button>
    </aside>
  );
}
