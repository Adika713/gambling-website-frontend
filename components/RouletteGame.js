import { useState } from 'react';
import axios from 'axios';

export default function RouletteGame() {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState('red');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpin = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/roulette/spin`,
        { bet, choice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to spin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-200 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Roulette</h2>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
        <div className="mb-4">
          <label htmlFor="bet" className="block text-blue-100 mb-2">
            Bet Amount
          </label>
          <input
            type="number"
            id="bet"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min="1"
            className="p-2 rounded bg-gray-700 text-blue-100 border border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="choice" className="block text-blue-100 mb-2">
            Bet On
          </label>
          <select
            id="choice"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className="p-2 rounded bg-gray-700 text-blue-100 border border-gray-600"
          >
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="green">Green</option>
          </select>
        </div>
        <button
          onClick={handleSpin}
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Spin
        </button>
        {result && (
          <div className="mt-4">
            <p className="text-blue-100">
              Result: {result.number} ({result.color})
            </p>
            <p className="text-blue-100">Outcome: {result.outcome}</p>
            <p className="text-blue-100">
              Balance: <img src="/chip.png" alt="Chip" className="inline w-4 h-4" onError={(e) => (e.target.src = '/chip.svg')} /> {result.balance}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}