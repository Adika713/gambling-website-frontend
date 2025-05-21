import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BlackjackGame() {
  const [gameState, setGameState] = useState(null);
  const [bet, setBet] = useState(10);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGameState = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack/state`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGameState(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load game state');
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  const handleDeal = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack/deal`,
        { bet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGameState(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGameState(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-200 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Blackjack</h2>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
        {!gameState ? (
          <div className="text-center">
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              min="1"
              className="p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 mb-4"
            />
            <button
              onClick={handleDeal}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Deal
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">
              Bet: <img src="/chip.png" alt="Chip" className="inline w-4 h-4" onError={(e) => (e.target.src = '/chip.svg')} /> {gameState.bet}
            </p>
            <p className="mb-2">Player Hand: {gameState.playerHand.join(', ')} (Value: {gameState.playerValue})</p>
            <p className="mb-4">Dealer Hand: {gameState.dealerHand.join(', ')} (Value: {gameState.dealerValue})</p>
            {gameState.status === 'active' ? (
              <div className="space-x-2">
                <button
                  onClick={() => handleAction('hit')}
                  disabled={isLoading}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Hit
                </button>
                <button
                  onClick={() => handleAction('stand')}
                  disabled={isLoading}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Stand
                </button>
              </div>
            ) : (
              <div>
                <p className="text-blue-100 mb-4">Outcome: {gameState.outcome}</p>
                <button
                  onClick={handleDeal}
                  disabled={isLoading}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  New Deal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}