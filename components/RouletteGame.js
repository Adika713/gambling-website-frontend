import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../pages/_app';

const RouletteGame = () => {
  const { balance, setBalance } = useContext(AuthContext);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState('red');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');

  const spin = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/roulette`,
        { betAmount, betType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.result);
      setMessage(res.data.outcome);
      setBalance(res.data.balance);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error spinning');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-blue-200">Roulette</h2>
      {message && <p className="text-red-400 mb-4">{message}</p>}
      <div className="mb-4">
        <label className="block text-blue-200">Bet Amount:</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
            min="1"
          />
          <img src="/chip.svg" alt="Chip" className="w-4 h-4" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-blue-200">Bet On:</label>
        <select
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
          className="p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
        >
          <option value="red">Red</option>
          <option value="black">Black</option>
          <option value="number">Number (0-36)</option>
        </select>
        {betType === 'number' && (
          <input
            type="number"
            placeholder="Enter number (0-36)"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500 mt-2"
            min="0"
            max="36"
          />
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-blue-200">Result: {result}</h3>
      </div>
      <button
        onClick={spin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Spin
      </button>
    </div>
  );
};

export default RouletteGame;