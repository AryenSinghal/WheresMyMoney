import './App.css';
import Dashboard from './dashboardComponents/Dashboard';
import Sidebar from './dashboardComponents/Sidebar';

function App() {
  return (
    <>
      <Sidebar />
      <div className="bg-gradient-to-br from-black via-[#2a0e4a] to-purple-700 min-h-screen overflow-hidden">
        {/* Title and Buttons Container */}
        <div className="flex items-center justify-between mt-18 lg:ml-15 sm:ml-16 md:ml-15 ml-15 -mb-10 px-5">
          <h1 className="text-white font-bold text-3xl text-left">
            My Dashboard
          </h1>
          
          {/* Buttons aligned to the right */}
          <div className="flex space-x-4">
            <button className="bg-[#8200DB] text-white p-2 rounded-lg  transition-all duration-200 ease-in-out hover:bg-[#6a00b3] active:bg-[#5900a1]">
              Take Picture of Receipt
            </button>
            <button className="bg-[#8200DB] text-white p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-[#6a00b3] active:bg-[#5900a1]">
              Upload Receipt
            </button>
          </div>
        </div>

        {/* Dashboard container */}
        <div className="w-screen h-screen flex items-center justify-center">
          <Dashboard />
        </div>
      </div>
    </>
  );
}

export default App;
