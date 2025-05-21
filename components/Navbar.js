import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaDice, FaTrophy, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../pages/_app';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, balance, setBalance } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchBalance = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBalance(res.data.balance);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
      fetchBalance();
    }
  }, [isAuthenticated, setBalance]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setBalance(1000);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-gray-800 shadow-lg p-4 flex justify-center items-center z-50">
      <div className="flex space-x-8 items-center">
        <Link href="/">
          <a
            className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
              isActive('/') ? 'border-b-2 border-blue-500' : ''
            }`}
          >
            <FaHome size={20} />
            <span>Home</span>
          </a>
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/blackjack">
              <a
                className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
                  isActive('/blackjack') ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <FaDice size={20} />
                <span>Blackjack</span>
              </a>
            </Link>
            <Link href="/roulette">
              <a
                className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
                  isActive('/roulette') ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <FaDice size={20} />
                <span>Roulette</span>
              </a>
            </Link>
            <Link href="/leaderboard">
              <a
                className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
                  isActive('/leaderboard') ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <FaTrophy size={20} />
                <span>Leaderboard</span>
              </a>
            </Link>
            <Link href="/profile">
              <a
                className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
                  isActive('/profile') ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                <FaUser size={20} />
                <span>Profile</span>
              </a>
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <Link href="/login">
            <a
              className={`flex items-center space-x-2 text-blue-200 hover:text-blue-400 transition-colors ${
                isActive('/login') ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              <FaUser size={20} />
              <span>Login</span>
            </a>
          </Link>
        )}
        {isAuthenticated && (
          <div className="absolute right-4 flex items-center space-x-1 text-blue-200">
            <span>Balance:</span>
            <img src="/chip.svg" alt="Chip" className="w-4 h-4" />
            <span>{balance}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;