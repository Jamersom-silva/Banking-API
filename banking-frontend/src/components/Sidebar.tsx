import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-slate-800">
        Banking
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block px-4 py-2 rounded ${
              isActive ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/deposit"
          className={({ isActive }) =>
            `block px-4 py-2 rounded ${
              isActive ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`
          }
        >
          Depósito
        </NavLink>

        <NavLink
          to="/withdraw"
          className={({ isActive }) =>
            `block px-4 py-2 rounded ${
              isActive ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`
          }
        >
          Saque
        </NavLink>

        <NavLink
          to="/transfer"
          className={({ isActive }) =>
            `block px-4 py-2 rounded ${
              isActive ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`
          }
        >
          Transferência
        </NavLink>
      </nav>

      <div className="p-4 text-xs text-slate-400 border-t border-slate-800">
        Banking API © 2025
      </div>
    </aside>
  );
}
