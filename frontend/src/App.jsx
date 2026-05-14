import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e6edf3] font-dm">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <h1 className="font-orbitron text-lg md:text-xl tracking-wide text-[#00e5ff]">
          SMART ENERGY OPTIMIZER
        </h1>
        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-[#00e5ff] font-medium' : 'text-gray-400 hover:text-white'
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? 'text-[#00e5ff] font-medium' : 'text-gray-400 hover:text-white'
            }
          >
            Analytics
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}
