import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/leaderboard`);
        setLeaders(res.data);
      } catch (err) {
        setError('Failed to load leaderboard');
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-blue-200">Leaderboard</h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-xl">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 border-b border-gray-600 text-blue-200">Rank</th>
            <th className="p-3 border-b border-gray-600 text-blue-200">Username</th>
            <th className="p-3 border-b border-gray-600 text-blue-200">Balance</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user._id} className="text-center text-blue-100">
              <td className="p-3 border-b border-gray-600">{index + 1}</td>
              <td className="p-3 border-b border-gray-600">{user.username}</td>
              <td className="p-3 border-b border-gray-600">
                <img src="/chip.svg" alt="Chip" className="inline w-4 h-4" /> {user.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}