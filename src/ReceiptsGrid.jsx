import React, { useState } from 'react';

const ReceiptsGrid = ({ images }) => {
  // State for managing the modal visibility and the selected image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle image click and open the modal
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {/* Grid of images */}
      <div className="grid grid-cols-3 gap-6 p-6 px-15">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 shadow-lg p-4"
            onClick={() => openModal(image)} // Open modal on click
          >
            <img
              src={image}
              alt={`img-${index}`}
              className="w-full object-cover mx-auto rounded-xl cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Modal to display the clicked image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-500 ease-out opacity-100"
          onClick={closeModal} // Close modal on outside click
        >
          <div
            className="relative transform scale-95 opacity-0 transition-all duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on the image itself
            style={{ opacity: 1, transform: 'scale(1)' }}
          >
            <img
              src={selectedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-xl transition-all duration-500 ease-in-out transform scale-100 opacity-100"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-xl bg-black rounded-full p-2"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptsGrid;
