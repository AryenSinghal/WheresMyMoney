import { readExpenses } from '../firebaseComponents/read';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

function StatsDashboard() {
  const expenses = readExpenses();

  // Calculate total amount spent
  const totalAmountSpent = expenses.reduce((total, expense) => {
    return total + (Number(expense.Amount) || 0); // Add the expense amount, defaulting to 0 if not defined
  }, 0);

  // Create data for Pie chart: category-wise spending
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    const amount = Number(expense.Amount) || 0;
    if (acc[category]) {
      acc[category] += amount;
    } else {
      acc[category] = amount;
    }
    return acc;
  }, {});

  // Prepare the data and labels for the Pie chart
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Pie chart options with data labels (percentages)
  const options = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
          return `${percentage}%`; // Display percentage
        },
        color: '#000', // Change text color to black
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',
        align: 'center',
      },
    },
  };

  return (
    <>
      {/* Box 2 - Right Box with margin-right */}
      <div className="w-40 h-22 md:w-50 bg-green-500 rounded-xl flex flex-col items-center justify-center text-white font-bold mr-4">
        <span className="text-sm">Total Receipts</span> {/* Caption */}
        <span className="text-3xl mt-2">{expenses.length}</span> {/* Number */}
      </div>

      {/* Pie Chart Section */}
      <div className="flex justify-center mt-4">
        <div className="w-80 h-80">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </>
  );
}

export default StatsDashboard;
