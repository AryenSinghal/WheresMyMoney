import React from 'react';
import { readExpenses } from '../firebaseComponents/read';

function RecentReceipts() {
  const expenses = readExpenses(); // Call the hook to get expenses

  return (
    <>
      <div className="flex flex-col items-center gap-4 mx-5 mt-4">
        {/* Check if there are any expenses and map over the top 3 */}
        {expenses.length > 0 ? (
          expenses.slice(0, 3).map((expense, index) => {
            // Convert Firestore Timestamp to JavaScript Date
            const formattedDate = new Date(expense.createdAt.seconds * 1000).toLocaleDateString('en-CA'); // YYYY-MM-DD format

            return (
              <div
                key={expense.id || index}
                className="w-full md:w-3/4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-4 flex flex-col gap-2 text-white"
              >
                {/* Expense Details */}
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{expense.category}</span>
                    <span className="text-sm text-gray-400">{formattedDate}</span>
                  </div>
                  <span className="font-bold text-xl">${expense.Amount}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white">No expenses found</p> // Show message if no expenses
        )}
      </div>
    </>
  );
}

export default RecentReceipts;
