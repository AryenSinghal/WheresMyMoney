import ProfileDashboard from './ProfileDashboard'
import StatsDashboard from './StatsDashboard';
import Chatbot from './Chatbot';
import RecentReceipts from './RecentReceipts'


function Dashboard() {
    return (
      <>
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-15">
          
          <div className="col-span-1 row-span-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700">
            <h2 className="text-white font-bold text-xl p-4">Welcome, Capy</h2>
            <ProfileDashboard/>

          </div>
  
          <div className="col-span-2 row-span-1 rounded-xl bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
            <h2 className="text-white font-bold text-xl p-4">Stats</h2>
            <StatsDashboard/>
          </div>
  
          <div className="col-span-1 row-span-3 rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-500">
            <h2 className="text-white font-bold text-xl p-4">Chatbot</h2>
            <Chatbot/>
          </div>
  
          <div className="col-span-2 row-span-2 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            <h2 className="text-white font-bold text-xl p-4">Recent Receipts</h2>
            <RecentReceipts/>
          </div>
          
        </div>
      </>
    );
  }
  
  export default Dashboard;
  