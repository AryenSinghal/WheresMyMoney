import './App.css';
import Sidebar from './dashboardComponents/Sidebar';
import ReceiptsGrid from './ReceiptsGrid';
import { useState, useEffect } from 'react'; // 🆕 Needed for fetching

function Receipts() {
  const [receipts, setReceipts] = useState([]);

  // Fetch receipts from Flask backend when page loads
  useEffect(() => {
    fetch('http://localhost:5001/expenses')
      .then(response => response.json())
      .then(data => setReceipts(data))
      .catch(error => console.error('Error fetching receipts:', error));
  }, []);

  // Handle Add New Receipt (simple hardcoded example for now)
  const handleAddReceipt = () => {
    const newReceipt = {
      name: "Test Store",
      amount: 10.99,
      category: "Misc",
      date: new Date().toISOString().split('T')[0] // today's date
    };
  
    fetch('http://localhost:5001/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReceipt),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add receipt');
        }
        return fetch('http://localhost:5001/expenses');
      })
      .then(response => response.json())
      .then(data => setReceipts(data))
      .catch(error => console.error('Error adding receipt:', error));
  };


  return (
    <>
      
      <div className="bg-gradient-to-br from-black via-[#2a0e4a] to-purple-700 min-h-screen overflow-hidden">
      <Sidebar />
        <div className="mt-5">
          <ReceiptsGrid receipts={receipts} />
        </div>
      </div>
    </>
  );
}

export default Receipts;
