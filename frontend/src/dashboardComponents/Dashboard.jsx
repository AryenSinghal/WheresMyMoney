import ProfileDashboard from './ProfileDashboard.jsx'
import StatsDashboard from './StatsDashboard.jsx';
import Chatbot from './Chatbot.jsx';
import RecentReceipts from './RecentReceipts.jsx'
import SemiCircleProgress from './SemiCircleProgress.jsx'
import React, { useState } from 'react';
import LineChartDashboard from './LineChartDashboard.jsx';




function Dashboard() {
    let budget = 1000;
    let spent = 100;

    const [isPieChart, setIsPieChart] = useState(true);

    const toggleChart = () => {
      setIsPieChart(prev => !prev);
    };

    return (
      <>
        <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-15 ">
          
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg drop-shadow-xl/25">
            <h2 className="text-white font-bold text-xl p-4 ">Welcome, Capy B.</h2>
            <ProfileDashboard/>

          </div>
  
          <div className="col-span-2 row-span-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg drop-shadow-xl ">
          <h2 className="text-white font-bold text-xl p-4">My Monthly Budget</h2>
          <SemiCircleProgress spent={spent} initialBudget={budget} /> 
        </div>

  
          <div className="col-span-1 row-span-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg  drop-shadow-xl/20">
            <h2 className="text-white font-bold text-xl p-4">Chatbot</h2>
            <Chatbot/>
          </div>
  
          <div className="col-span-2 row-span-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg drop-shadow-xl/20 p-6 relative">
            {/* 🧠 Title and Toggle Button Row */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-3xl">Stats</h2>
              <button 
                onClick={toggleChart}
                className="text-white bg-white/20 hover:bg-white/10 font-bold py-1 px-3 rounded"
              >
                {isPieChart ? 'View Yearly Spending' : 'View Monthly Spending'}
              </button>
            </div>

            {/* 🎯 Chart Display */}
            <div className="flex justify-center items-center">
              {isPieChart ? <StatsDashboard /> : <LineChartDashboard />}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default Dashboard;