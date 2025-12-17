export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-6">
      <h1 className="text-xl font-bold mb-8">Banking</h1>

      <nav className="space-y-4">
        <a className="block text-slate-300 hover:text-white">Dashboard</a>
        <a className="block text-slate-300 hover:text-white">Transferências</a>
        <a className="block text-slate-300 hover:text-white">Extrato</a>
      </nav>
    </aside>
  );
}
