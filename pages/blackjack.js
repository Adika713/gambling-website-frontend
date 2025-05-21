import { useState, useContext } from 'react';
import { AuthContext } from '../pages/_app';
import axios from 'axios';

export default function Blackjack() {
  const { isAuthenticated, balance, refreshBalance } = useContext(AuthContext);
  const [betAmount, setBetAmount] = useState(0);
  const [gameState, setGameState] = useState(null);

  const placeBet = async () => {
    if (!isAuthenticated) return alert('Please log in.');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/games/blackjack/bet`,
        { amount: betAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGameState(res.data);
      await refreshBalance();
    } catch (err) {
      console.error('Bet failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-200 text-center">Blackjack</h2>
        {isAuthenticated ? (
          <>
            <p className="text-blue-100 mb-4">Balance: {balance} credits</p>
            <div className="mb-4">
              <label htmlFor="bet" className="block text-blue-100 mb-2">Bet Amount</label>
              <input
                type="number"
                id="bet"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600"
              />
            </div>
            <button
              onClick={placeBet}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Place Bet
            </button>
            {gameState && (
              <p className="text-blue-100 mt-4">Outcome: {gameState.outcome}</p>
            )}
          </>
        ) : (
          <p className="text-blue-100">Please log in to play.</p>
        )}
      </div>
    </div>
  );
}