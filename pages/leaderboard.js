import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/leaderboard`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-200 text-center">Leaderboard</h2>
        <table className="w-full text-blue-100">
          <thead>
            <tr>
              <th className="text-left p-2">Rank</th>
              <th className="text-left p-2">Player</th>
              <th className="text-right p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={player._id} className="border-t border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{player.discordName || 'Unknown'}</td>
                <td className="p-2 text-right">{player.balance} credits</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}