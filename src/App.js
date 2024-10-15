import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'; 
import FileUpload from './components/FileUpload'; 


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [esgData, setEsgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = 'cs6jo4hr01qkeuli40u0cs6jo4hr01qkeuli40ug'; 

  // Fetch ESG data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=esg&token=${apiKey}`);
        console.log('API Response:', response.data);

        if (response.data.metric) {
          const data = response.data.metric;
          const transformedData = [
            { date: '2023-01-01', score: data['esgScore'] }, 
          ];
          setEsgData(transformedData); 
        } else {
          console.error('No metric data found in the response.');
        }
      } catch (error) {
        console.error('Error fetching ESG data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

 
  const handleDataLoaded = (data) => {
    const transformedData = data.map(item => ({
      date: item.Date, // Assuming your CSV has a "Date" column
      score: item.Score, // Assuming your CSV has a "Score" column
    }));
    setEsgData(transformedData); 
  };

 
  const chartData = {
    labels: esgData.map(item => item.date),
    datasets: [{
      label: 'ESG Score',
      data: esgData.map(item => item.score),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  return (
    <div>
      <h1>ESG Dashboard</h1>

      {/* File Upload Component */}
      <FileUpload onDataLoaded={handleDataLoaded} />

      {/* CSV Export Button */}
      <CSVLink data={esgData} filename={"esg_data.csv"} className="export-button">
        Export CSV
      </CSVLink>

      {/* Display Chart */}
      <div className="chart-container">
        {loading ? (
          <p>Loading data...</p> 
        ) : (
          <Line data={chartData} />
        )}
      </div>
    </div>
  );
}

export default App;
