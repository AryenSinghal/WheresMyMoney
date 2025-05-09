import React, { useState, useEffect } from 'react';
import { readExpenses } from './firebaseComponents/read';
import { deleteExpenseById } from './firebaseComponents/delete'; 

const ReceiptsGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState(null);

  // Fetch expenses from the database using readExpenses hook
  const allReceipts = readExpenses();
  
  // Extract unique categories from the receipts
  const categories = ['All', ...new Set(allReceipts.map(r => r.category))];

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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Filter receipts based on selected category
  const filteredReceipts =
    selectedCategory === 'All'
      ? allReceipts
      : allReceipts.filter(r => r.category === selectedCategory);

  const handleDelete = (id) => {
    setReceiptToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (receiptToDelete) {
      await deleteExpenseById(receiptToDelete);
    }
    window.location.reload();
  
    setIsConfirmOpen(false);
    setReceiptToDelete(null);
  };
  
  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setReceiptToDelete(null);
  };

  return (
    <div className="container mx-auto">
      {/* Filter bar with proper margin-top */}
      <div className="flex flex-wrap justify-center gap-3 p-4 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 hover:bg-purple-400 active:bg-purple-800 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 active:bg-white/30'
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
            className="relative h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg drop-shadow-xl/25 rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-semibold"
          >
            {/* Delete button */}
            <button
              onClick={() => handleDelete(receipt.id)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white text-sm p-2 rounded-full transition"
            > 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 2h4a1 1 0 011 1v1H9V3a1 1 0 011-1z" />
              </svg>
            </button>

            {/* Receipt content - clicking opens modal */}
            <div onClick={() => openModal(receipt)} className="text-center cursor-pointer">
              <h2 className="text-2xl -mt-6">{receipt.merchName}</h2>
              <p>Price: ${receipt.Amount}</p>
              <p>{formatDate(receipt.createdAt.toDate())}</p>
            </div>

            {/* Category tag */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
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
            <p className="text-gray-700">Location: {selectedReceipt.merchName}</p>
            <p className="text-gray-700">Category: {selectedReceipt.category}</p>
            <p className="text-gray-700">Price: ${selectedReceipt.Amount}</p>
            <p className="text-gray-700">Date: {formatDate(selectedReceipt.createdAt.toDate())}</p>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg relative w-80 text-center">
            <p className="text-gray-800 text-lg mb-4">Are you sure you want to delete this receipt?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsGrid;