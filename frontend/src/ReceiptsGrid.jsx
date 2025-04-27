import React, { useState, useEffect } from 'react';
import { readExpenses } from './firebaseComponents/read';

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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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

  const confirmDelete = () => {
    // Actually delete the receipt from the page (you can hook up Firebase here later)
    console.log('Deleting receipt with id:', receiptToDelete);
  
    // Remove the deleted receipt locally
    const updatedReceipts = allReceipts.filter(r => r.id !== receiptToDelete);
    // You need a way to update allReceipts, we'll discuss that if needed
  
    setIsConfirmOpen(false);
    setReceiptToDelete(null);
  
    // ⚡️ NOTE: If allReceipts comes from a real Firebase hook, 
    // you should instead call your delete API and let the hook refresh the list.
  };
  
  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setReceiptToDelete(null);
  };
  
      

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
            className="relative h-48 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-semibold"
          >
            {/* Delete button */}
            <button
              onClick={() => handleDelete(receipt.id)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white text-sm px-2 py-1 rounded-full hover:bg-opacity-40 transition"
            > 
              Delete
            </button>

            {/* Receipt content - clicking opens modal */}
            <div onClick={() => openModal(receipt)} className="text-center cursor-pointer">
              <h2 className="text-2xl -mt-6">{receipt.merchName}</h2>
              <p>Total Price: {receipt.Amount}</p>
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
            <p className="text-gray-700">Total Price: {selectedReceipt.Amount}</p>
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
    </>
  );
};

export default ReceiptsGrid;
