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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for balance refresh');
        return;
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Balance refresh response:', res.data);
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to refresh balance:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App useEffect: token exists:', !!token);
    if (token) {
      setIsAuthenticated(true);
      refreshBalance();
    } else {
      setIsAuthenticated(false);
      setBalance(0);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, balance, refreshBalance }}>
      <Head>
        <title>Gambling Website</title>
        <meta name="description" content="Virtual currency gambling platform" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <div className="min-h-screen bg-zinc-900 text-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <Component {...pageProps} />
        </main>
        <footer className="text-center py-4 text-teal-400">
          <p>This site uses virtual currency for entertainment purposes only.</p>
          <p>
            <a href="https://beawaregambling.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
              Be Aware Gambling
            </a>
          </p>
          <a
            href="https://paypal.me/airfalcon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 text-gray-100 px-4 py-2 rounded mt-2 hover:bg-teal-700"
          >
            Donate via PayPal
          </a>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}