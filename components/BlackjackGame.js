import { useState } from 'react';
import axios from 'axios';

const BlackjackGame = () => {
  const [, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [message, setMessage] = useState('');

  const startGame = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack`,
        { action: 'deal', bet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayerCards(res.data.playerCards);
      setDealerCards([res.data.dealerCards[0], { face: 'hidden', value: '?' }]);
      setBalance(res.data.balance);
      setGameStatus('playing');
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error starting game');
    }
  };

  const hit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack`,
        { action: 'hit' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayerCards(res.data.playerCards);
      if (res.data.status === 'bust') {
        setGameStatus('over');
        setMessage('You busted! Game over.');
        setBalance(res.data.balance);
        setDealerCards(res.data.dealerCards);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error hitting');
    }
  };

  const stand = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/blackjack`,
        { action: 'stand' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDealerCards(res.data.dealerCards);
      setGameStatus('over');
      setMessage(res.data.outcome);
      setBalance(res.data.balance);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error standing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Blackjack</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Bet Amount:</label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="p-2 border rounded"
          min="1"
          disabled={gameStatus === 'playing'}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Dealer's Cards</h3>
        <div className="flex space-x-2">
          {dealerCards.map((card, index) => (
            <div key={index} className="p-2 bg-white border rounded shadow">
              {card.face}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Your Cards</h3>
        <div className="flex space-x-2">
          {playerCards.map((card, index) => (
            <div key={index} className="p-2 bg-white border rounded shadow">
              {card.face}
            </div>
          ))}
        </div>
      </div>
      <div className="space-x-4">
        <button
          onClick={startGame}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={gameStatus === 'playing'}
        >
          Deal
        </button>
        <button
          onClick={hit}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={gameStatus !== 'playing'}
        >
          Hit
        </button>
        <button
          onClick={stand}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          disabled={gameStatus !== 'playing'}
        >
          Stand
        </button>
      </div>
    </div>
  );
};

export default BlackjackGame;