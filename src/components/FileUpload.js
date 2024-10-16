import React from 'react';
import Papa from 'papaparse';

function FileUpload({ onDataLoaded }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.csv')) {
     
      Papa.parse(file, {
        header: true, 
        skipEmptyLines: true, 
        complete: (results) => {
          console.log('CSV Data:', results.data);
          if (results.data.length > 0) {
            onDataLoaded(results.data); 
          } else {
            alert('The CSV file is empty or has an invalid format.');
          }
        },
      });
    } else {
      alert('Unsupported file format. Please upload a valid CSV file.');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
