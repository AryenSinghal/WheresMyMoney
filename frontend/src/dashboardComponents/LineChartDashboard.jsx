import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { readExpenses } from '../firebaseComponents/read';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels);

function LineChartDashboard() {
  const expenses = readExpenses();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 = Jan, 11 = Dec

  // Calculate the past 12 months
  const past12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - i, 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleString('default', { month: 'long' }),
    };
  }).reverse();

  // Initialize array for each month's spending
  const monthlyTotals = new Array(12).fill(0);

  expenses.forEach((expense) => {
    const expenseDate = expense.createdAt.toDate();
    const amount = Number(expense.Amount) || 0;

    past12Months.forEach((monthData, index) => {
      if (
        expenseDate.getFullYear() === monthData.year &&
        expenseDate.getMonth() === monthData.month
      ) {
        monthlyTotals[index] += amount;
      }
    });
  });

  const labels = past12Months.map((monthData) => monthData.label);

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
