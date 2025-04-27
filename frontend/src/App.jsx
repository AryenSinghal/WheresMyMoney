import './App.css';
import Dashboard from './dashboardComponents/Dashboard';
import Sidebar from './dashboardComponents/Sidebar';

function App() {
  return (
    <>
      
      <div className="bg-gradient-to-br from-black via-[#2a0e4a] to-purple-700 min-h-screen overflow-hidden">
      <Sidebar />
        {/* Title and Buttons Container */}
        <div className="flex items-center justify-between mt-13 lg:mt-5 lg:ml-15 ml-10 -mb-10 px-5">
          {/* <h1 className="text-white font-bold text-3xl text-left">
            My Dashboard
          </h1> */}
          
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
