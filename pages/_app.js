import '../styles/globals.css';
import Navbar from '../components/Navbar';
import RegisterModal from '../components/RegisterModal';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowModal(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
      <div className="pt-16">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;