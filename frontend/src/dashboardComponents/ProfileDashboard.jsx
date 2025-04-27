import RecentReceipts from './RecentReceipts.jsx'
import swampy from '../assets/swampy.png'
import { readExpenses } from '../firebaseComponents/read';

function ProfileDashboard() {
  const expenses = readExpenses();
  const totalAmountSpent = expenses.reduce((total, expense) => {
    return total + (Number(expense.Amount) || 0); // Add the expense amount, defaulting to 0 if not defined
  }, 0);
  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        {/* Profile Picture with Gradient Border */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse"></div>
          <img 
            src={swampy}  
            alt="Profile Picture" 
            className="absolute inset-1 w-30 h-30 rounded-full object-cover border-4 border-[#0F0B15]"
          />
        </div>
        
        {/* Profile Info */}
        <div className="text-center mb-6">
          <h3 className="text-white font-bold text-xl mb-1">Swampy</h3>
          <p className="text-white/60 text-sm">Premium Member</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/60 text-sm mb-1">Total Spent</p>
            <p className="text-white font-bold text-lg">${Number(totalAmountSpent).toFixed()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-white/60 text-sm mb-1">Transactions</p>
            <p className="text-white font-bold text-lg">{expenses.length}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6">
        <div className="border-t border-white/10" />
      </div>

      {/* Recent Receipts Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h2 className="text-white font-bold text-lg mb-4">Recent Receipts</h2>
          <RecentReceipts/>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;