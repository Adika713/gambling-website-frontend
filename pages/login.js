import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from '../pages/_app';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPanel() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      router.push('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email,
        password,
        username,
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      router.push('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const switchMode = (newMode) => {
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
    setMode(newMode);
  };

  const panelVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-200 text-center">Log In</h2>
              {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-blue-100 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-blue-100 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
              </form>
              <p className="text-blue-100 mt-4 text-center">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-blue-400 hover:underline"
                >
                  Register
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-200 text-center">Register</h2>
              {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-blue-100 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-blue-100 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-blue-100 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-blue-100 border border-gray-600 focus:outline-none focus:border-blue-500"
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
              <p className="text-blue-100 mt-4 text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-400 hover:underline"
                >
                  Log In
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}