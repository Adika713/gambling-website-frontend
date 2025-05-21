import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../pages/_app';

const RegisterModal = ({ onClose }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        email,
        password,
        username,
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      window.dispatchEvent(new Event('authChange'));
      setIsOpen(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-200">Register</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-blue-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-blue-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
        <button
          onClick={() => {
            setIsOpen(false);
            onClose();
          }}
          className="mt-4 text-blue-400 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;