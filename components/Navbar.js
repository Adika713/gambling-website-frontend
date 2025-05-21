import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../pages/_app';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated, balance } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-zinc-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex space-x-4">
          <Link
            href="/"
            className={`text-gray-100 hover:text-teal-300 ${isActive('/') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/blackjack"
            className={`text-gray-100 hover:text-teal-300 ${isActive('/blackjack') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
          >
            Blackjack
          </Link>
          <Link
            href="/roulette"
            className={`text-gray-100 hover:text-teal-300 ${isActive('/roulette') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
          >
            Roulette
          </Link>
          <Link
            href="/leaderboard"
            className={`text-gray-100 hover:text-teal-300 ${isActive('/leaderboard') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
          >
            Leaderboard
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className={`text-gray-100 hover:text-teal-300 ${isActive('/profile') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={`text-gray-100 hover:text-teal-300 ${isActive('/logout') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`text-gray-100 hover:text-teal-300 ${isActive('/login') ? 'text-teal-300 border-b-2 border-teal-300' : ''}`}
            >
              Login
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {isAuthenticated && (
            <span className="text-gray-100">Balance: {balance} credits</span>
          )}
        </div>
      </div>
    </nav>
  );
}