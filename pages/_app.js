import '../styles/globals.css';
import Navbar from '../components/Navbar';
import RegisterModal from '../components/RegisterModal';
import { createContext, useState, useEffect } from 'react';
import Head from 'next/head';

export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(1000);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setShowModal(true);
    }

    const handleAuthChange = () => {
      const newToken = localStorage.getItem('token');
      setIsAuthenticated(!!newToken);
      if (!newToken) {
        setBalance(1000);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, balance, setBalance }}>
      <Head>
        <link rel="icon" href="/chip.svg" type="image/svg+xml" />
        <title>Casino</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        {showModal && !isAuthenticated && (
          <RegisterModal onClose={() => setShowModal(false)} />
        )}
        <div className="pt-16">
          <Component {...pageProps} />
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default MyApp;