import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../pages/_app';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Profile() {
  const { isAuthenticated, balance } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // Handle Discord OAuth callback
  useEffect(() => {
    const { token } = router.query;
    if (token) {
      console.log('Profile: Received token from Discord:', token.substring(0, 10) + '...');
      localStorage.setItem('token', token);
      router.replace('/profile', undefined, { shallow: true }); // Clear query params
      fetchUser();
    }
  }, [router]);

  const fetchUser = async (attempt = 1) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Profile fetchUser: attempt:', attempt, 'token exists:', !!token, 'token:', token ? token.substring(0, 10) + '...' : 'none');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Profile response:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err.response?.status, err.response?.data || err.message);
      if (attempt < 3 && err.response?.status === 401) {
        console.log(`Retrying fetchUser: attempt ${attempt + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return fetchUser(attempt + 1);
      }
      setError(
        err.response?.status === 401
          ? 'Authentication failed. Please log in again.'
          : err.response?.status === 404
          ? 'User profile not found. Please re-register or contact support.'
          : err.response?.data?.message || 'Failed to load profile'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setLoading(false);
      setError('Please log in to view your profile');
    }
  }, [isAuthenticated]);

  const discordAuthUrl = `https://gambling-website-backend.onrender.com/auth/discord`;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          {error.includes('log in') && (
            <Link href="/login" className="text-teal-400 hover:text-teal-300">
              Go to Login
            </Link>
          )}
          {error.includes('re-register') && (
            <Link href="/register" className="text-teal-400 hover:text-teal-300">
              Register
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <p className="text-red-500">Failed to load profile data.</p>
      </div>
    );
  }

  const { discordName, discordId, discordAvatar, email, gameHistory = [] } = user;
  const totalPages = Math.ceil(gameHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = gameHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-teal-300 text-center">Profile</h2>
        <div className="text-gray-100 mb-6">
          {discordId ? (
            <div className="flex items-center mb-4">
              {discordAvatar && (
                <img
                  src={discordAvatar}
                  alt="Discord PFP"
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <p><strong>Discord:</strong> {discordName || 'Unknown'} (Discord is connected)</p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-gray-100 mb-2">Connect your Discord account</p>
              <a
                href={discordAuthUrl}
                className="inline-block bg-teal-600 text-gray-100 px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Connect with Discord
              </a>
            </div>
          )}
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Balance:</strong> {balance} credits</p>
        </div>
        <h3 className="text-xl font-bold mb-4 text-teal-300">Bet History</h3>
        {gameHistory.length === 0 ? (
          <p className="text-gray-100">No bets placed yet.</p>
        ) : (
          <>
            <table className="w-full text-gray-100 mb-4">
              <thead>
                <tr>
                  <th className="text-left p-2">Game</th>
                  <th className="text-right p-2">Bet Amount</th>
                  <th className="text-right p-2">Outcome</th>
                  <th className="text-right p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentHistory.map((bet, index) => (
                  <tr key={index} className="border-t border-zinc-700">
                    <td className="p-2">{bet.game}</td>
                    <td className="p-2 text-right">{bet.amount} credits</td>
                    <td className="p-2 text-right">{bet.outcome}</td>
                    <td className="p-2 text-right">{

new Date(bet.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-teal-600 text-gray-100 px-4 py-2 rounded hover:bg-teal-700 disabled:bg-zinc-600"
              >
                Previous
              </button>
              <span className="text-gray-100">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-teal-600 text-gray-100 px-4 py-2 rounded hover:bg-teal-700 disabled:bg-zinc-600"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}