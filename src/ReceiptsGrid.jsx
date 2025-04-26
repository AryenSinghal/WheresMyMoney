import React, { useState } from 'react';

const allReceipts = [
  { id: 1, category: 'Entertainment' },
  { id: 2, category: 'Travel' },
  { id: 3, category: 'Groceries' },
  { id: 4, category: 'Dining' },
  { id: 5, category: 'Utilities' },
  { id: 6, category: 'Health' },
  { id: 7, category: 'Travel' },
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
            Receipt #{receipt.id}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
              {receipt.category}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg relative w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Receipt #{selectedReceipt.id}</h2>
            <p className="text-gray-700">Category: {selectedReceipt.category}</p>
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
