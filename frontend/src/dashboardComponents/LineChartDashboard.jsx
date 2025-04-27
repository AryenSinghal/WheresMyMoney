import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { readExpenses } from '../firebaseComponents/read';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels);

function LineChartDashboard() {
  const expenses = readExpenses();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Filter expenses from THIS year
  const yearlyExpenses = expenses.filter((expense) => {
    const expenseDate = expense.createdAt.toDate();
    return expenseDate.getFullYear() === currentYear;
  });

  // Initialize array for each month's spending
  const monthlyTotals = new Array(12).fill(0);

  yearlyExpenses.forEach((expense) => {
    const date = expense.createdAt.toDate();
    const amount = Number(expense.Amount) || 0;
    const month = date.getMonth(); // 0 = Jan, 11 = Dec
    monthlyTotals[month] += amount;
  });

  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyTotals,
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.4,
        pointBackgroundColor: '#36A2EB',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          font: {
            weight: 'bold',
            size: 16,
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF',
        },
      },
    },
  };

  return (
    <div className="w-[32rem] h-[32rem] mt-0">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default LineChartDashboard;
