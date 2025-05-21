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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Balance</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">${user.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}