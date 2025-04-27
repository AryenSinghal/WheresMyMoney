import { readExpenses } from '../firebaseComponents/read';

function StatsDashboard() {
  const expenses = readExpenses(); 
  const totalAmountSpent = expenses.reduce((total, expense) => {
    return total + (Number(expense.Amount) || 0); // Add the expense amount, defaulting to 0 if not defined
  }, 0);

    return (
      <>
        <div className="flex justify-center gap-x-3">
          {/* Box 1 - Left Box with margin-left */}
          <div className="w-40 h-22 md:w-50 bg-blue-500 rounded-xl flex flex-col items-center justify-center text-white font-bold ml-4">
            <span className="text-sm">Total Spent</span>  {/* Caption */}
            <span className="text-3xl mt-2">${totalAmountSpent}</span> {/* Number */}
          </div>
  
          {/* Box 2 - Right Box with margin-right */}
          <div className="w-40 h-22 md:w-50 bg-green-500 rounded-xl flex flex-col items-center justify-center text-white font-bold mr-4">
            <span className="text-sm">Total Receipts</span>  {/* Caption */}
            <span className="text-3xl mt-2">{expenses.length}</span> {/* Number */}
          </div>
        </div>
      </>
    );
  }
  
  export default StatsDashboard;
  