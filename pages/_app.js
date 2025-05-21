import { createContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import '../styles/transitions.css';

export const AuthContext = createContext();

export default function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
        </footer>
      </div>
    </AuthContext.Provider>
  );
}