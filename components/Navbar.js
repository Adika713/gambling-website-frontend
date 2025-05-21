import Link from 'next/link';
import { FaHome, FaDice, FaTrophy, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [balance, setBalance] = useState(1000);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user balance
      const fetchBalance = async () => {
        try {
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setBalance(1000);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-800 text-white p-4 flex justify-center items-center shadow-md">
      <div className="flex space-x-8 items-center">
        <Link href="/">
          <a className="flex items-center space-x-2 hover:text-yellow-400">
            <FaHome size={20} />
            <span>Home</span>
          </a>
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/blackjack">
              <a className="flex items-center space-x-2 hover:text-yellow-400">
                <FaDice size={20} />
                <span>Blackjack</span>
              </a>
            </Link>
            <Link href="/roulette">
              <a className="flex items-center space-x-2 hover:text-yellow-400">
                <FaDice size={20} />
                <span>Roulette</span>
              </a>
            </Link>
            <Link href="/leaderboard">
              <a className="flex items-center space-x-2 hover:text-yellow-400">
                <FaTrophy size={20} />
                <span>Leaderboard</span>
              </a>
            </Link>
            <Link href="/profile">
              <a className="flex items-center space-x-2 hover:text-yellow-400">
                <FaUser size={20} />
                <span>Profile</span>
              </a>
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:text-yellow-400"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <Link href="/login">
            <a className="flex items-center space-x-2 hover:text-yellow-400">
              <FaUser size={20} />
              <span>Login</span>
            </a>
          </Link>
        )}
        {isAuthenticated && (
          <div className="absolute right-4">
            <link rel="icon" href="/chip.svg" type="image/svg+xml" /><span>Balance: {balance}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;