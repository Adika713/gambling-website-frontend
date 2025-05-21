import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from '../pages/_app';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default function AuthPanel() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, refreshBalance } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', res.data);
      const token = res.data.token;
      if (!token) {
        throw new Error('No token received from login');
      }
      localStorage.setItem('token', token);
      console.log('Token set:', token.substring(0, 10) + '...');
      setIsAuthenticated(true);
      // Retry refreshBalance up to 3 times
      let attempts = 0;
      while (attempts < 3) {
        try {
          await refreshBalance();
          break;
        } catch (err) {
          console.warn(`Refresh balance attempt ${attempts + 1} failed:`, err.message);
          attempts++;
          if (attempts === 3) throw err;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      setTimeout(() => router.push('/profile'), 100);
    } catch (err) {
      console.error('Login failed:', err.response?.status, err.response?.data || err.message);
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
      console.log('Register response:', res.data);
      const token = res.data.token;
      if (!token) {
        throw new Error('No token received from register');
      }
      localStorage.setItem('token', token);
      console.log('Token set:', token.substring(0, 10) + '...');
      setIsAuthenticated(true);
      // Retry refreshBalance up to 3 times
      let attempts = 0;
      while (attempts < 3) {
        try {
          await refreshBalance();
          break;
        } catch (err) {
          console.warn(`Refresh balance attempt ${attempts + 1} failed:`, err.message);
          attempts++;
          if (attempts === 3) throw err;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      setTimeout(() => router.push('/profile'), 100);
    } catch (err) {
      console.error('Register failed:', err.response?.status, err.response?.data || err.message);
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

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <TransitionGroup>
          <CSSTransition
            key={mode}
            timeout={300}
            classNames="fade"
          >
            <div>
              {mode === 'login' ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-teal-300 text-center">Log In</h2>
                  {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-100 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-gray-100 border border-zinc-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="password" className="block text-gray-100 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-gray-100 border border-zinc-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-gray-100 p-2 rounded hover:bg-teal-700 transition-colors"
                    >
                      Log In
                    </button>
                  </form>
                  <p className="text-gray-100 mt-4 text-center">
                    No account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      Register
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-teal-300 text-center">Register</h2>
                  {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                  <form onSubmit={handleRegister}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-gray-100 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-gray-100 border border-zinc-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-100 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-gray-100 border border-zinc-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="password" className="block text-gray-100 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-700 text-gray-100 border border-zinc-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-gray-100 p-2 rounded hover:bg-teal-700 transition-colors"
                    >
                      Register
                    </button>
                  </form>
                  <p className="text-gray-100 mt-4 text-center">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      Log In
                    </button>
                  </p>
                </>
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}