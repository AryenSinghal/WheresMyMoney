import React, { useState } from 'react';

const ReceiptsGrid = ({ receipts }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Extract unique categories from real receipts
  const categories = ['All', ...new Set(receipts.map(r => r.category))];

  const openModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const filteredReceipts =
    selectedCategory === 'All'
      ? receipts
      : receipts.filter(r => r.category === selectedCategory);

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
      {filteredReceipts.length === 0 ? (
        // No receipts case
        <div className="text-center text-white mt-20">
          <div className="text-6xl mb-4">🧾</div>
          <h2 className="text-2xl font-bold mb-2">No receipts yet!</h2>
          <p className="text-md text-gray-300">Click "Add New Receipt" to create your first one.</p>
        </div>
      ) : (
        // Normal grid if receipts exist
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 px-15">
          {filteredReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="relative h-56 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-lg font-semibold cursor-pointer p-4"
              onClick={() => openModal(receipt)}
            >
              <div className="mb-2 text-2xl font-bold">{receipt.name}</div>
              <div className="text-white text-md">${receipt.amount.toFixed(2)}</div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                {receipt.category}
              </div>
            </div>
          ))}
        </div>
      )}

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
            <h2 className="text-xl font-bold mb-2">{selectedReceipt.name}</h2>
            <p className="text-gray-700 mb-2">Amount: ${selectedReceipt.amount.toFixed(2)}</p>
            <p className="text-gray-700 mb-2">Category: {selectedReceipt.category}</p>
            <p className="text-gray-500 text-sm">Date: {selectedReceipt.date}</p>
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
