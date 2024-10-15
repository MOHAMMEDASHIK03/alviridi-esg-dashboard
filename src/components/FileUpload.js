import React from 'react';
import Papa from 'papaparse';

function FileUpload({ onDataLoaded }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true, // Use the first row as headers
        complete: (results) => {
          console.log(results.data); // Log the parsed data
          onDataLoaded(results.data); // Pass the data to the parent component
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
