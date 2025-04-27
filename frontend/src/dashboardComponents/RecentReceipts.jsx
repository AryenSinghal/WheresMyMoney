import React from 'react';
import { readExpenses } from '../firebaseComponents/read';

function RecentReceipts() {
  const expenses = readExpenses(); // Call the hook to get expenses

  return (
    <div className="flex flex-col gap-3">
      {expenses.length > 0 ? (
        expenses.slice(0, 3).map((expense, index) => {
          const formattedDate = new Date(expense.createdAt.seconds * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={expense.id || index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg">{expense.merchName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                      {expense.category || 'Uncategorized'}
                    </span>
                    <span className="text-sm text-white/60">
                      {formattedDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">${expense.Amount}</div>
                </div>
              </div>
              {/* Hover effect - gradient line at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white/60">No receipts yet</p>
          <p className="text-sm text-white/40 mt-1">Add your first receipt to get started</p>
        </div>
      )}
    </div>
  );
}

export default RecentReceipts;