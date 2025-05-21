import { useState } from 'react';
import axios from 'axios';

const RouletteGame = () => {
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState('red');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const [, setBalance] = useState(1000);

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Roulette</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="p-2 border rounded"
          min="1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Bet On:</label>
        <select
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="red">Red</option>
          <option value="black">Black</option>
          <option value="number">Number (0-36)</option>
        </select>
        {betType === 'number' && (
          <input
            type="number"
            placeholder="Enter number (0-36)"
            className="p-2 border rounded mt-2"
            min="0"
            max="36"
          />
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Result: {result}</h3>
      </div>
      <button
        onClick={spin}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Spin
      </button>
    </div>
  );
};

export default RouletteGame;