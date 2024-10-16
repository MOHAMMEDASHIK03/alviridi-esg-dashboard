import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
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
  const [csvData, setCsvData] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [labels, setLabels] = useState([]);

  
  const handleDataLoaded = (data) => {
   
    const columnNames = Object.keys(data[0]);
    const firstColumn = columnNames[0]; 
    const numericCols = columnNames.filter(col => data.every(row => !isNaN(parseFloat(row[col])))); 

    setCsvData(data);
    setLabels(data.map(row => row[firstColumn])); 
    setNumericColumns(numericCols); 
  };

  
  const createGraphs = () => {
    return numericColumns.map((column, index) => {
      const chartData = {
        labels: labels, 
        datasets: [{
          label: column,
          data: csvData.map(row => parseFloat(row[column])), 
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }],
      };

      return (
        <div key={index} className="chart-container">
          <h3>{column} Data</h3>
          <Line data={chartData} />
        </div>
      );
    });
  };

  
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('CSV Data Report', 10, 10);
    
    
    csvData.forEach((row, index) => {
      doc.text(JSON.stringify(row), 10, 20 + (10 * index));
    });

    doc.save('csv_data.pdf'); 
  };

  return (
    <div>
      <h1>ESG Data Dashboard</h1>

      {/* File Upload Component */}
      <FileUpload onDataLoaded={handleDataLoaded} />

      {/* CSV Export Button */}
      <CSVLink data={csvData} filename={"csv_data.csv"} className="export-button">
        Export CSV
      </CSVLink>

      {/* PDF Export Button */}
      <button onClick={exportPDF} className="export-button">
        Export PDF
      </button>

      {/* Display Graphs */}
      {csvData.length > 0 ? createGraphs() : <p>No data to display</p>}
    </div>
  );
}

export default App;
