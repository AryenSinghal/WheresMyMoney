import React, { useState } from 'react';
import { readExpenses } from '../firebaseComponents/read';

function SemiCircleProgress({ spent, initialBudget }) {
  const expenses = readExpenses();
  const [budget, setBudget] = useState(initialBudget);
  const [isEditing, setIsEditing] = useState(false);

  const radius = 150;
  const stroke = 20;
  const circumference = Math.PI * radius;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = expense.createdAt.toDate();
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalAmountSpent = monthlyExpenses.reduce((total, expense) => {
    return total + (Number(expense.Amount) || 0);
  }, 0);
  
  const percentage = budget ? Math.min((totalAmountSpent / budget) * 100, 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="relative w-[400px] h-[200px] -mt-10 mx-auto">
      <svg width="400" height="200" viewBox="0 0 400 250">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        
        <g transform="translate(-10, 0) scale(1.2, 1)">
          <path
            d="M 25 175 A 150 150 0 0 1 325 175"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={stroke}
          />
          <path
            d="M 25 175 A 150 150 0 0 1 325 175"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </g>

        <text
          x="10"
          y="190"
          fontSize="16"
          fill="rgba(255,255,255,0.5)"
        >
          $0
        </text>
        <text
          x="390"
          y="190"
          fontSize="16"
          fill="rgba(255,255,255,0.5)"
          textAnchor="end"
        >
          ${budget}
        </text>
      </svg>

      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center text-white">
        <div className="text-3xl font-bold mb-1">${Number(totalAmountSpent).toFixed(2)}</div>
        <div className="text-sm text-white/70 mb-1">spent this month</div>
        <div className="text-lg font-medium text-purple-400">{Math.round(percentage)}% of budget</div>
      </div>

      <button
        onClick={toggleEdit}
        className="absolute bottom-6 right-6 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        {isEditing ? "Save" : "Edit Budget"}
      </button>

      {isEditing && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-32"
          />
        </div>
      )}
    </div>
  );
}

export default SemiCircleProgress;