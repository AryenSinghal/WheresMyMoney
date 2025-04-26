import React from 'react';

function RecentReceipts() {
  return (
    <>
      <div className="flex justify-center gap-4 mx-5"> {/* Adjusted gap to gap-4 for consistent spacing */}
        {/* Box 1 */}
        <div className="w-40 h-65 md:w-50 bg-blue-500 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white font-bold relative">
          {/* Image inside Box 1 */}
          <img
            src="https://via.placeholder.com/150"
            alt="Box 1"
            className="absolute inset-0 w-full h-full object-cover opacity-50" // Makes the image cover the box with reduced opacity
          />

        </div>

        {/* Box 2 */}
        <div className="w-40 h-65 md:w-50 bg-green-500 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white font-bold relative">
          {/* Image inside Box 2 */}
          <img
            src="https://via.placeholder.com/150"
            alt="Box 2"
            className="absolute inset-0 w-full h-full object-cover opacity-50" // Makes the image cover the box with reduced opacity
          />
        </div>

        {/* Box 3 */}
        <div className="w-40 h-65 md:w-50 bg-purple-500 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white font-bold relative">
          {/* Image inside Box 3 */}
          <img
            src="https://via.placeholder.com/150"
            alt="Box 3"
            className="absolute inset-0 w-full h-full object-cover opacity-50" // Makes the image cover the box with reduced opacity
          />

        </div>
      </div>
    </>
  );
}

export default RecentReceipts;
