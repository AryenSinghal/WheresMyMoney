import React, { useState } from 'react';

function SemiCircleProgress({ spent, initialBudget }) {
  const [budget, setBudget] = useState(initialBudget);  // State to track the budget
  const [isEditing, setIsEditing] = useState(false);   // State to toggle edit mode

  const percentage = Math.min((spent / budget) * 100, 100);
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
      <svg width="200" height="200" viewBox="0 0 350 200"> 
        <path
          d="M 25 175 A 150 150 0 0 1 325 175"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress Arc */}
        <path
          d="M 25 175 A 150 150 0 0 1 325 175"
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
          y="190"
          fontSize="20"
          fill="#ffffff"
        >
          $0
        </text>
        {/* Right Label - Total Budget */}
        <text
          x="325"
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
        className="absolute bottom-6 left-1/2 transform translate-x-33 -translate-y-7 text-white bg-blue-500 hover:bg-blue-600 px-2 py-2 rounded-lg text-sm"
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
