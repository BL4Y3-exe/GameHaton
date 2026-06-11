import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-night/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint text-night">
            <Gamepad2 className="h-5 w-5" />
          </span>
          GameHaton
        </Link>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button as={Link} to="/login">
            Try Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
