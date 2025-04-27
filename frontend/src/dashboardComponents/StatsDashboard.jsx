import { readExpenses } from '../firebaseComponents/read';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

function StatsDashboard() {
  const expenses = readExpenses();

  // Get the current date and extract the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (January - December)
  const currentYear = currentDate.getFullYear();

  // Filter expenses to only include those from the current month
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = expense.createdAt.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Calculate total amount spent this month
  const totalAmountSpent = monthlyExpenses.reduce((total, expense) => {
    return total + (Number(expense.Amount) || 0); // Add the expense amount, defaulting to 0 if not defined
  }, 0);

  // Create data for Pie chart: category-wise spending this month
  const categoryData = monthlyExpenses.reduce((acc, expense) => {
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
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
          return `${percentage}%`; // Display percentage
        },
        font: {
          color: '#FFFFFF', // Ensure the text is white
          weight: 'normal', // Make text not bold
          size: 18, // Increase font size
        },
        anchor: 'center', // Anchor at the center
        align: 'center', // Align the label in the center
        offset: 0, // Adjust this value to ensure the text is correctly positioned
      },
      legend: {
        position: 'right', // Position the legend to the right
        labels: {
          color: '#FFFFFF', // Make legend text white
          boxWidth: 20,
          padding: 20,
          font: {
            weight: 'bold', // Make legend text bold
            size: 16, // Increase legend text size
          },
        },
      },
    },
  };

  return (
    <>
      {/* Pie Chart Section */}
      <div className="flex justify-center mt-4">
        <div className="flex">
          <div className="w-96 h-96 -m-25"> {/* Increase size of Pie chart */}
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StatsDashboard;
