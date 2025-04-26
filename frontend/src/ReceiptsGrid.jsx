import React, { useState } from 'react';

// Add a date to each receipt
const allReceipts = [
  { id: 1, category: 'Entertainment', location: 'Walmart', price: '$20.00', date: '2023-04-12' },
  { id: 2, category: 'Travel', location: 'Hotel ABC', price: '$150.00', date: '2023-03-28' },
  { id: 3, category: 'Groceries', location: 'Whole Foods', price: '$35.50', date: '2023-04-02' },
  { id: 4, category: 'Dining', location: 'Restaurant XYZ', price: '$40.00', date: '2023-04-10' },
  { id: 5, category: 'Utilities', location: 'Electricity Bill', price: '$60.00', date: '2023-03-30' },
  { id: 6, category: 'Health', location: 'Doctor Visit', price: '$120.00', date: '2023-04-05' },
  { id: 7, category: 'Travel', location: 'Flight Ticket', price: '$200.00', date: '2023-04-08' },
];

const categories = ['All', ...new Set(allReceipts.map(r => r.category))];

const ReceiptsGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const openModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  // Format the date to MM/DD/YYYY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const filteredReceipts =
    selectedCategory === 'All'
      ? allReceipts
      : allReceipts.filter(r => r.category === selectedCategory);

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-3 p-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of receipt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 px-15">
        {filteredReceipts.map((receipt) => (
          <div
            key={receipt.id}
            className="relative h-48 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-semibold cursor-pointer"
            onClick={() => openModal(receipt)}
          >
            <div>
              <h2 className='text-2xl -mt-6'>{receipt.location}</h2>
              <p>Total Price: {receipt.price}</p>
              <p>{formatDate(receipt.date)}</p> {/* Display the formatted date */}
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
              {receipt.category}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReceipt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg relative w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-700">Category: {selectedReceipt.category}</p>
            <p className="text-gray-700">Location: {selectedReceipt.location}</p>
            <p className="text-gray-700">Total Price: {selectedReceipt.price}</p>
            <p className="text-gray-700">Date: {formatDate(selectedReceipt.date)}</p> {/* Display date in modal */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptsGrid;
