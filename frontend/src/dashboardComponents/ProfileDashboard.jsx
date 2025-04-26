
import RecentReceipts from './RecentReceipts.jsx'
import capybara from '../assets/capybara.jpg'

function ProfileDashboard() {
  return (
    <div className="flex flex-col justify-between h-full">

      <img 
        src={capybara}  
        alt="Profile Picture" 
        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover mx-auto mb-5"
      />
      <div className="border-t-2 border-white w-4/5 mx-auto mb-3" />


      <h2 className="text-white font-bold text-l text-center ">Recent Receipts</h2>
      
      <div className="flex justify-center flex-grow">
        <div className="flex flex-col items-center space-y-2">
          
          <RecentReceipts/>
        </div>
      </div>

      {/* Action Buttons */}

    </div>
  );
}

export default ProfileDashboard;
