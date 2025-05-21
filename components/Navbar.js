import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../pages/_app';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated, balance } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex space-x-4">
          <Link href="/" className="text-blue-100 hover:text-blue-400">
            Home
          </Link>
          <Link href="/blackjack" className="text-blue-100 hover:text-blue-400">
            Blackjack
          </Link>
          <Link href="/roulette" className="text-blue-100 hover:text-blue-400">
            Roulette
          </Link>
          <Link href="/leaderboard" className="text-blue-100 hover:text-blue-400">
            Leaderboard
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="text-blue-100 hover:text-blue-400">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-100 hover:text-blue-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-blue-100 hover:text-blue-400">
              Login
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {isAuthenticated && (
            <span className="text-blue-100">Balance: {balance} credits</span>
          )}
        </div>
      </div>
    </nav>
  );
}