import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../pages/_app';

export default function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    if (isAuthenticated) fetchUser();

    // Handle OAuth callback query parameters
    const { error, success } = router.query;
    if (error) setError(decodeURIComponent(error));
    if (success) setSuccess(decodeURIComponent(success));
  }, [router.query, isAuthenticated]);

  const connectDiscord = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to connect with Discord');
      return;
    }
    const state = encodeURIComponent(token);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord?state=${state}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-blue-200">Profile</h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">{success}</p>}
      {user && (
        <div className="space-y-6">
          {/* Discord Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-4">
            {user.discordId ? (
              <>
                <img
                  src={user.discordAvatar}
                  alt="Discord Avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-xl font-semibold text-blue-200">
                    {user.discordName}
                  </h3>
                  <p className="text-blue-100">Connected to Discord</p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-blue-200 text-sm">No Avatar</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-200">Not Connected</h3>
                  <button
                    onClick={connectDiscord}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Connect with Discord
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Info Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-200">Account Details</h3>
            <p className="text-blue-100 mb-2">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-blue-100 mb-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-blue-100 mb-4">
              <strong>Balance:</strong>{' '}
              <img src="/chip.svg" alt="Chip" className="inline w-4 h-4" /> {user.balance}
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-4 text-blue-200">Game History</h3>
            <ul className="space-y-2">
              {user.gameHistory.map((game, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-700 rounded border border-gray-600 text-blue-100"
                >
                  {game.game} - Bet: <img src="/chip.svg" alt="Chip" className="inline w-4 h-4" />{' '}
                  {game.bet} - Outcome: {game.outcome} -{' '}
                  {new Date(game.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}