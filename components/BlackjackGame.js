import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../pages/_app';

const BlackjackGame = () => {
  const { balance, setBalance } = useContext(AuthContext);
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
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-blue-200">Blackjack</h2>
      {message && <p className="text-red-400 mb-4">{message}</p>}
      <div className="mb-4">
        <label className="block text-blue-200">Bet Amount:</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
            min="1"
            disabled={gameStatus === 'playing'}
          />
          <img src="/chip.svg" alt="Chip" className="w-4 h-4" />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-blue-200">Dealer's Cards</h3>
        <div className="flex space-x-2">
          {dealerCards.map((card, index) => (
            <div
              key={index}
              className="p-2 bg-gray-700 border border-gray-600 rounded shadow-md text-blue-100"
            >
              {card.face}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-blue-200">Your Cards</h3>
        <div className="flex space-x-2">
          {playerCards.map((card, index) => (
            <div
              key={index}
              className="p-2 bg-gray-700 border border-gray-600 rounded shadow-md text-blue-100"
            >
              {card.face}
            </div>
          ))}
        </div>
      </div>
      <div className="space-x-4">
        <button
          onClick={startGame}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-600"
          disabled={gameStatus === 'playing'}
        >
          Deal
        </button>
        <button
          onClick={hit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:bg-gray-600"
          disabled={gameStatus !== 'playing'}
        >
          Hit
        </button>
        <button
          onClick={stand}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-600"
          disabled={gameStatus !== 'playing'}
        >
          Stand
        </button>
      </div>
    </div>
  );
};

export default BlackjackGame;