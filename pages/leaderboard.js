import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        console.log('Leaderboard fetch: token exists:', !!token);
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/leaderboard`, config);
        console.log('Leaderboard response:', res.data);
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-teal-300 text-center">Leaderboard</h2>
        {loading ? (
          <p className="text-gray-100 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-100 text-center">No players found.</p>
        ) : (
          <table className="w-full text-gray-100">
            <thead>
              <tr>
                <th className="text-left p-2">Rank</th>
                <th className="text-left p-2">Player</th>
                <th className="text-right p-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr key={player._id} className="border-t border-zinc-700">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{player.discordName || 'Unknown'}</td>
                  <td className="p-2 text-right">{player.balance} credits</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}