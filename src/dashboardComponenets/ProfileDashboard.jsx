import profilePicture from '../assets/capybara.jpg';

function ProfileDashboard() {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Profile Section */}
      <div className="flex justify-center flex-grow">
        <div className="flex flex-col items-center space-y-2">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-40 lg:h-40 rounded-full object-cover"
          />
          <h2 className="text-white font-bold text-xl">Name</h2>
        </div>
      </div>

      {/* Add new receipt button */}
      <div className="flex justify-center mb-15 p-5">
        <button className="bg-blue-500 text-white p-2 rounded-lg w-40 transition-all duration-300 ease-in-out hover:bg-blue-600 active:bg-blue-900">
          Add New Receipt
        </button>
      </div>
    </div>
  );
}

export default ProfileDashboard;
