import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Profile() {
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
    fetchUser();

    // Handle OAuth callback query parameters
    const { error, success } = router.query;
    if (error) setError(decodeURIComponent(error));
    if (success) setSuccess(decodeURIComponent(success));
  }, [router.query]);

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Balance:</strong> ${user.balance}</p>
          <p><strong>Discord:</strong> {user.discordId ? 'Connected' : 'Not Connected'}</p>
          {!user.discordId && (
            <button
              onClick={connectDiscord}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
            >
              Connect with Discord
            </button>
          )}
          <h3 className="text-lg font-semibold mt-4">Game History</h3>
          <ul>
            {user.gameHistory.map((game, index) => (
              <li key={index} className="p-2 border-b">
                {game.game} - Bet: ${game.bet} - Outcome: {game.outcome} - {new Date(game.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}