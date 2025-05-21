import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../pages/_app';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-200">
          Gambling Site
        </Link>
        <div className="flex items-center space-x-4">
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
              <Link href="/profile" className="text-blue-100 hover:text-blue-400 flex items-center">
                <FaUser className="mr-1" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-100 hover:text-blue-400 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-blue-100 hover:text-blue-400">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}