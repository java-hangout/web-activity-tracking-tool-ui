import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import './PieChartPage.css'; // Import the CSS file for the pie chart

// Register necessary chart elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const PieChartPage = () => {
  const location = useLocation(); // Get the location
  const navigate = useNavigate(); // Hook to navigate to another page
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const reports = location.state?.reports; // Get the reports passed via location.state

  useEffect(() => {
    if (!reports || reports.length === 0) return;

    // Flatten the reports to get an array of all visited sites with their time spent
    const siteData = reports.flatMap((report) =>
      report.users.flatMap((user) =>
        user.browsers.flatMap((browser) =>
          browser.visitedSites.map((site) => ({
            title: site.title,
            timeSpent: site.totalTimeSpentInMinutes,
          }))
        )
      )
    );

    // Sort the sites by time spent in descending order
    const sortedSiteData = siteData.sort((a, b) => b.timeSpent - a.timeSpent);

    // Get the top 10 websites based on time spent
    const top10Sites = sortedSiteData.slice(0, 10);

    // Extract the top 10 site titles and their corresponding time spent
    const siteTitles = top10Sites.map((site) => site.title);
    const timeSpent = top10Sites.map((site) => site.timeSpent);

    // Set the data for the pie chart
    setChartData({
      labels: siteTitles,
      datasets: [
        {
          label: 'Time Spent (minutes)',
          data: timeSpent,
          backgroundColor: [
            'rgba(255,99,132,0.6)',
            'rgba(54,162,235,0.6)',
            'rgba(255,206,86,0.6)',
            'rgba(75,192,192,0.6)',
            'rgba(153,102,255,0.6)',
            'rgba(255,159,64,0.6)',
            'rgba(240,128,128,0.6)',
            'rgba(0,255,255,0.6)',
            'rgba(124,252,0,0.6)',
            'rgba(255,105,180,0.6)',
          ], // Add custom colors for each section
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
        },
      ],
    });
  }, [reports]); // Re-run when reports change

  useEffect(() => {
    // Cleanup the chart when the component unmounts or before creating a new one
    if (chartRef.current) {
      const chartInstance = chartRef.current.chartInstance;
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the previous chart instance
      }
    }
  }, [chartData]);

  // Function to handle back to report button click
  const handleBackToReport = () => {
    navigate('/reports'); // Redirect to the reports page, or use navigate(-1) to go back to the previous page
  };

  return (
    <div className="pie-chart-container">
      <h2>Top 10 Websites by Time Spent</h2>
      <button className="back-to-report-button" onClick={handleBackToReport}> Back to Report </button>
      {chartData && (
        <Pie
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Disable aspect ratio
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.label}: ${tooltipItem.raw} minutes`;
                  },
                },
              },
              legend: {
                position: 'top',
              },
            },
          }}
        />
      )}
      
    </div>
  );
};

export default PieChartPage;
