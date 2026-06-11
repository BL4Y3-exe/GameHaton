import { NavLink, useNavigate } from 'react-router-dom';
import { Flame, Gamepad2, Gift, LayoutDashboard, Library, LogOut, RefreshCw } from 'lucide-react';
import Button from '../common/Button.jsx';
import { logout } from '../../services/auth.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/revival-queue', label: 'Revival Queue', icon: RefreshCw },
  { to: '/deals', label: 'Free Games & Sales', icon: Gift },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="fixed bottom-0 left-0 top-auto z-20 w-full border-t border-white/10 bg-night/95 px-3 py-2 backdrop-blur md:bottom-auto md:top-0 md:h-screen md:w-64 md:border-r md:border-t-0 md:p-5">
      <div className="hidden items-center gap-3 md:flex">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-night">
          <Gamepad2 className="h-5 w-5" />
        </span>
        <div>
          <p className="font-black">GameHaton</p>
          <p className="text-xs text-slate-400">Revival dashboard</p>
        </div>
      </div>

      <nav className="grid grid-cols-4 gap-1 md:mt-8 md:flex md:flex-col md:gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-12 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition md:justify-start md:px-3 md:text-sm ${
                isActive ? 'bg-mint text-night' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-lg border border-ember/25 bg-ember/10 p-4 md:block">
        <Flame className="h-5 w-5 text-ember" />
        <p className="mt-3 text-sm font-bold">Demo mode active</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Mock data is wired to match the backend contract.</p>
      </div>

      <Button variant="ghost" className="mt-auto hidden w-full md:flex" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </aside>
  );
}
