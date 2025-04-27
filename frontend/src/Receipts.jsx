import './App.css';
import Sidebar from './dashboardComponents/Sidebar';
import ReceiptsGrid from './ReceiptsGrid';
import { useState, useEffect } from 'react';

function Receipts() {
  const [receipts, setReceipts] = useState([]);

  // Fetch receipts from Flask backend when page loads
  useEffect(() => {
    fetch('http://localhost:5001/expenses')
      .then(response => response.json())
      .then(data => setReceipts(data))
      .catch(error => console.error('Error fetching receipts:', error));
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-black via-[#1a0a2a] to-purple-900 min-h-screen overflow-hidden">
        <Sidebar />
        <div className="pt-24"> {/* Added padding-top to prevent content from being hidden */}
          <ReceiptsGrid receipts={receipts} />
        </div>
      </div>
    </>
  );
}

export default Receipts;