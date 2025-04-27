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

  // Improved pie chart options with better percentage labels
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20, // Add padding around the chart
    },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage to 1 decimal place
          
          // Only show percentage label for segments that are large enough
          // This helps prevent overlapping on small segments
          return percentage > 5 ? `${percentage}%` : '';
        },
        color: (context) => {
          // Dynamically determine color based on background color brightness
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = (value / total) * 100;
          
          // For very small segments, hide the label by matching the background color
          if (percentage < 5) {
            return context.dataset.backgroundColor[context.dataIndex];
          }
          
          return '#FFFFFF'; // White text for most segments
        },
        font: {
          weight: 'bold',
          size: 14,
        },
        textStrokeColor: '#000000', // Add black outline to text
        textStrokeWidth: 1,        // Width of the outline
        // Adjust position for better visibility
        anchor: 'center',
        align: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = (value / total) * 100;
          
          // For larger segments, place label in center
          // For medium segments, move label slightly outward
          return percentage > 15 ? 'center' : 'end';
        },
        offset: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = (value / total) * 100;
          
          // For medium segments, push label outward slightly
          return percentage > 15 ? 0 : 20;
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      legend: {
        position: 'right',
        labels: {
          color: '#FFFFFF',
          boxWidth: 20,
          padding: 15,
          font: {
            weight: 'bold',
            size: 14,
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
          <div className="w-100 h-100 -mt-25"> {/* Maintain appropriate chart size */}
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StatsDashboard;