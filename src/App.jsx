import './App.css';
import Dashboard from './dashboardComponenets/Dashboard';
import Sidebar from './dashboardComponenets/Sidebar';

function App() {
  return (
    <>
      <Sidebar />
      <div className="bg-slate-900 min-h-screen overflow-hidden">
        {/* Title */}
        <h1 className="text-white font-bold text-3xl text-left mt-18 lg:ml-15 sm:ml-16 md:ml-15 ml-15 -mb-10">
          My Dashboard
        </h1>
        
        {/* Dashboard container */}
        <div className="w-screen h-screen flex items-center justify-center">
          <Dashboard />
        </div>
      </div>
    </>
  );
}

export default App;
