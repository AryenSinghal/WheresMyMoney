import React from 'react';
import { readExpenses } from '../firebaseComponents/read';

function RecentReceipts() {
  const expenses = readExpenses(); // Call the hook to get expenses

  return (
    <>
      <div className="flex justify-center gap-4 mx-5">
        {/* Check if there are any expenses and map over the top 3 */}
        {expenses.length > 0 ? (
          expenses.slice(0, 3).map((expense, index) => {
            // Convert Firestore Timestamp to JavaScript Date
            const formattedDate = new Date(expense.createdAt.seconds * 1000).toLocaleString();

            return (
              <div
                key={expense.id || index}
                className={`w-40 h-65 md:w-50 bg-${['blue', 'green', 'purple'][index]}-500 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white font-bold relative`}
              >
                {/* Image inside each Box */}
                <img
                  src="https://via.placeholder.com/150"
                  alt={`Box ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* Expense Details */}
                <div className="absolute bottom-2 left-2 text-xl font-bold">
                  <p>{expense.category}</p> {/* Displaying the expense name */}
                  <p>${expense.Amount}</p> {/* Displaying the expense amount */}
                  <p>{formattedDate}</p> {/* Displaying the formatted date */}
                </div>
              </div>
            );
          })
        ) : (
          <p>No expenses found</p> // Show message if no expenses
        )}
      </div>
    </>
  );
}

export default RecentReceipts;
