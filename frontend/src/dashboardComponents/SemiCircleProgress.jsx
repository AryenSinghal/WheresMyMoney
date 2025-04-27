import React, { useState } from 'react';

function SemiCircleProgress({ spent, initialBudget }) {
  const [budget, setBudget] = useState(initialBudget);  // State to track the budget
  const [isEditing, setIsEditing] = useState(false);   // State to toggle edit mode

  const percentage = budget ? Math.min((spent / budget) * 100, 100) : 0;
  const radius = 150;  // Increased radius for a larger circle
  const stroke = 20;   // Adjusted stroke width
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Function to handle the budget change
  const handleBudgetChange = (e) => {
    setBudget(e.target.value);  // Update the budget state
  };

  // Function to toggle the edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);  // Toggle between edit and view mode
  };

  return (
    <div className="relative w-[200px] h-[200px] -mt-15 mx-auto">
      <svg width="400" height="200" viewBox="0 0 600 250">
        <g transform="translate(-80, 0) scale(1.2, 1)">
          <path
            d="M 25 175 A 150 150 0 0 1 325 175"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <path
            d="M 25 175 A 150 150 0 0 1 325 175"
            fill="none"
            stroke="#8200DB"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </g>

        {/* Labels (notice their x positions updated) */}
        <text
          x="10"    // moved left to match new arc
          y="190"
          fontSize="20"
          fill="#ffffff"
        >
          $0
        </text>
        <text
          x="390"   // moved right to match new arc
          y="190"
          fontSize="20"
          fill="#ffffff"
          textAnchor="end"
        >
          ${budget}
        </text>
      </svg>

      {/* Inner Labels (centered in arc) */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center text-white">
        <div className="text-lg font-medium mt-5">${spent} spent</div>
        <div className="text-md">{Math.round(percentage)}%</div>
      </div>

      {/* Edit Budget Button */}
      <button
        onClick={toggleEdit}
        className="absolute bottom-6 left-1/2 transform translate-x-33 -translate-y-7 text-white bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-sm"
      >
        {isEditing ? "Save" : "Edit Budget"}
      </button>

      {/* Budget Input when editing */}
      {isEditing && (
        <div className="absolute bottom-20 left-1/2 transform translate-x-15 text-center text-white">
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            className="bg-gray-800 text-white p-3 rounded-lg w-50"
          />
        </div>
      )}
    </div>
  );
}

export default SemiCircleProgress;
