import React, { useState } from 'react';
import ProfileDashboard from './ProfileDashboard.jsx';
import SemiCircleProgress from './SemiCircleProgress.jsx'
import StatsDashboard from './StatsDashboard.jsx';
import Chatbot from './Chatbot.jsx';
import RecentReceipts from './RecentReceipts.jsx'
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
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-4 grid-rows-3 gap-4 p-4 lg:p-8">
          
          {/* Profile Section - Modern Card with Gradient Border */}
          <div className="col-span-1 row-span-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white bg-clip-text">
                  Welcome back, Capy
                </h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <ProfileDashboard/>
              </div>
            </div>
          </div>
  
          {/* Budget Card */}
          <div className="col-span-1 lg:col-span-2 row-span-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Monthly Budget</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
              <SemiCircleProgress spent={spent} initialBudget={budget} /> 
            </div>
          </div>
  
          {/* Chatbot Card */}
          <div className="col-span-1 row-span-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Financial Assistant
                </h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <Chatbot/>
              </div>
            </div>
          </div>
  
          {/* Stats Card */}
          <div className="col-span-1 lg:col-span-2 row-span-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="h-full flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
                <button 
                  onClick={toggleChart}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isPieChart ? 'View Yearly Trend' : 'View Categories'}
                </button>
              </div>

              <div className="flex-1 flex justify-center items-center">
                {isPieChart ? <StatsDashboard /> : <LineChartDashboard />}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default Dashboard;