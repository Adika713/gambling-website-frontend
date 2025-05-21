import { createContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/globals.css';
import '../styles/transitions.css';

export const AuthContext = createContext();

export default function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);

  const refreshBalance = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.error('Failed to refresh balance:', err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      refreshBalance();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, balance, refreshBalance }}>
      <Head>
        <title>Gambling Website</title>
        <meta name="description" content="Virtual currency gambling platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-blue-200">
        <Navbar />
        <main className="container mx-auto p-4">
          <Component {...pageProps} />
        </main>
        <footer className="text-center py-4 text-blue-400">
          <p>This site uses virtual currency for entertainment purposes only.</p>
          <p>
            <a href="https://beawaregambling.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Be Aware Gambling
            </a>
          </p>
          <a
            href="https://paypal.me/airfalcon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
          >
            Donate via PayPal
          </a>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}