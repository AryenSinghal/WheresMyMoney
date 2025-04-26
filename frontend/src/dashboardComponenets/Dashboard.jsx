import ProfileDashboard from './ProfileDashboard'
import StatsDashboard from './StatsDashboard';
import Chatbot from './Chatbot';
import RecentReceipts from './RecentReceipts'


function Dashboard() {
    return (
      <>
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-15 ">
          
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg   drop-shadow-xl/25">
            <h2 className="text-white font-bold text-xl p-4 ">Welcome, Capy B.</h2>
            <ProfileDashboard/>

          </div>
  
          <div className="col-span-2 row-span-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg   drop-shadow-xl/25">
            <h2 className="text-white font-bold text-xl p-4">Stats</h2>
            <StatsDashboard/>
          </div>
  
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg  drop-shadow-xl/20">
            <h2 className="text-white font-bold text-xl p-4">Chatbot</h2>
            <Chatbot/>
          </div>
  
          <div className="col-span-2 row-span-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg   drop-shadow-xl/20">
            <h2 className="text-white font-bold text-xl p-4">Recent Receipts</h2>
            <RecentReceipts/>
          </div>
          
        </div>
      </>
    );
  }
  
  export default Dashboard;
  