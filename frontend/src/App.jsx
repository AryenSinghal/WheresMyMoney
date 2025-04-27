import './App.css';
import Dashboard from './dashboardComponents/Dashboard';
import Sidebar from './dashboardComponents/Sidebar';

function App() {
  return (
    <>
      <div className="bg-[#0F0B15] min-h-screen overflow-hidden relative">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMTAiPjwvcmVjdD4KPC9zdmc+')] opacity-20" />
        
        <div className="relative z-10">
          <Sidebar />
          <div className="w-screen h-screen flex items-center justify-center pt-16">
            <Dashboard />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;