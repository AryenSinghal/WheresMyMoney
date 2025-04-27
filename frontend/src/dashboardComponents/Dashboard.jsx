import ProfileDashboard from './ProfileDashboard.jsx'
import StatsDashboard from './StatsDashboard.jsx';
import Chatbot from './Chatbot.jsx';
import RecentReceipts from './RecentReceipts.jsx'
import SemiCircleProgress from './SemiCircleProgress.jsx'
import React from 'react';


function Dashboard() {
    let budget = 100;
    let spent = 100;
    return (
      <>
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-15 ">
          
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg drop-shadow-xl/25">
            <h2 className="text-white font-bold text-xl p-4 ">Welcome, Capy B.</h2>
            <ProfileDashboard/>

          </div>
  
          <div className="col-span-2 row-span-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg drop-shadow-xl ">
          <h2 className="text-white font-bold text-xl p-4">My Monthly Budget</h2>
          <SemiCircleProgress spent={spent} budget={budget} /> 
        </div>

  
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg  drop-shadow-xl/20">
            <h2 className="text-white font-bold text-xl p-4">Chatbot</h2>
            <Chatbot/>
          </div>
  
          <div className="col-span-2 row-span-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg drop-shadow-xl/20 p-6">
            <h2 className="text-white font-bold text-xl mb-6">Spending by Category</h2>
            <div className="flex justify-center items-center">
              <StatsDashboard/>
            </div>
          </div>

          
        </div>
      </>
    );
  }
  
  export default Dashboard;