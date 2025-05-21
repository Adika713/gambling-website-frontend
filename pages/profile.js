import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

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
  }, []);

  const connectDiscord = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/discord`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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