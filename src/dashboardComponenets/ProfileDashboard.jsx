import SemiCircleProgress from './SemiCircleProgress';
import capybara from '../assets/capybara.jpg'

function ProfileDashboard() {
  const spent = 75;
  const budget = 1000;

  return (
    <div className="flex flex-col justify-between h-full">

      <img 
        src={capybara}  
        alt="Profile Picture" 
        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover mx-auto mb-5"
      />
      <div className="border-t-2 border-white w-4/5 mx-auto mb-3" />


      <h2 className="text-white font-bold text-l text-center ">My Budget</h2>
      {/* Progress Section */}
      <div className="flex justify-center flex-grow">
        <div className="flex flex-col items-center space-y-2">
          <SemiCircleProgress spent={spent} budget={budget} />
          
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center space-y-4 mb-15 p-5">
        <button className="bg-blue-500 text-white p-2 rounded-lg lg:w-60 transition-all duration-300 ease-in-out hover:bg-blue-600 active:bg-blue-900">
          Connect Email
        </button>
        <button className="bg-blue-500 text-white p-2 lg:w-60 rounded-lg  transition-all duration-300 ease-in-out hover:bg-blue-600 active:bg-blue-900">
          Add New Receipt
        </button>
      </div>
    </div>
  );
}

export default ProfileDashboard;
