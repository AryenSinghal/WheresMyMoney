import React, { useState } from 'react';

function SemiCircleProgress({ spent, budget }) {
  const [isEditing, setIsEditing] = useState(false);   // State to toggle edit mode

  const percentage = Math.min((spent / budget) * 100, 100);
  const radius = 60;  // Adjusted radius to fit better inside the grid
  const stroke = 8;   // Reduced stroke width for smaller size
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Function to toggle the edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);  // Toggle between edit and view mode
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* SVG Circle */}
      <svg width="120" height="120" viewBox="0 0 150 150">
        <path
          d="M 25 125 A 80 80 0 0 1 125 125"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress Arc */}
        <path
          d="M 25 125 A 80 80 0 0 1 125 125"
          fill="none"
          stroke="#8200DB"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        {/* Left Label - 0 */}
        <text
          x="25"
          y="135"
          fontSize="12"
          fill="#ffffff"
        >
          $0
        </text>
        {/* Right Label - Total Budget */}
        <text
          x="125"
          y="135"
          fontSize="12"
          fill="#ffffff"
          textAnchor="end"
        >
          ${budget}
        </text>
      </svg>

      {/* Inner Labels (centered in arc) */}
      <div className="absolute text-center text-white">
        <div className="text-sm font-medium">${spent} spent</div>
        <div className="text-sm">{Math.round(percentage)}%</div>
      </div>

      {/* Edit Budget Button */}
      <button
        onClick={toggleEdit}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white bg-white/20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm"
      >
        {isEditing ? "Save" : "Edit Budget"}
      </button>

      {/* Budget Input when editing */}
      {isEditing && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white">
          <input
            type="number"
            value={budget}
            onChange={(e) => budget = e.target.value}
            className="bg-gray-800 text-white p-2 rounded-lg w-[80px]"
          />
        </div>
      )}
    </div>
  );
}

export default SemiCircleProgress;