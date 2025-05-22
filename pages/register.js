import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../pages/_app';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, refreshBalance } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      console.log('Register: Received token from Discord:', token.substring(0, 10) + '...');
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      refreshBalance();
      router.push('/profile');
    }
  }, [router, setIsAuthenticated, refreshBalance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { email, password, username };
    console.log('Register payload:', payload);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, payload);
      console.log('Register response:', res.data);
      console.log('Register payload:', { email, password, username });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      await refreshBalance();
      router.push('/profile');
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  const discordAuthUrl = `https://gambling-website-backend.onrender.com/auth/discord`;

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-teal-300 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-100 mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-100 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-100 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-gray-100 py-2 rounded hover:bg-teal-700 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-100 mb-2">Or connect with Discord</p>
          <a
            href={discordAuthUrl}
            className="inline-block bg-teal-600 text-gray-100 px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Connect with Discord
          </a>
        </div>
        <p className="mt-4 text-gray-100 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-400 hover:text-teal-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}