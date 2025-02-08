import React, { useState, useEffect } from 'react';
import './App.css';
import './FileUpload.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Clear fetched data on refresh
  useEffect(() => {
    setJsonData(null);
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://65.0.75.79:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      setUploadError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF from the displayed data
  const generatePDF = async () => {
    try {
      const element = document.querySelector('.main-container');
      if (!element) {
        console.error('Main container not found!');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 0;
      while (y < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight);
        y += pageHeight;
        if (y < imgHeight) pdf.addPage();
      }

      pdf.save('Consolidated_Report.pdf');
      console.log('PDF successfully generated');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Render a formatted table from JSON data
  const renderTable = (data, title) => {
    if (!data || !data.years) return <p>No {title} data available.</p>;

    const years = data.years;
    const categories = Object.keys(data).filter((key) => key !== 'years');

    return (
      <div className="table-container">
        <h2 className="table-heading">{title}</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Category / Label</th>
              {years.map((year) => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const categoryData = data[category];
              if (typeof categoryData === 'object') {
                return (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={years.length + 1} className="category-header">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                    </tr>
                    {Object.entries(categoryData).map(([subcategory, values]) => (
                      <tr key={subcategory}>
                        <td>{subcategory}</td>
                        {years.map((year, idx) => (
                          <td key={year}>{values[idx]}</td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {/* File Upload Form */}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {uploadError && <p className="error-message">{uploadError}</p>}

      {/* Render Tables if Data is Available */}
      {jsonData && (
        <div className="main-container">
          {renderTable(jsonData.balance_sheet, 'Balance Sheet')}
          {renderTable(jsonData.ratios, 'Ratios')}
          {renderTable(jsonData.profit_loss, 'Profit & Loss')}
        </div>
      )}

      {/* PDF Button */}
      {jsonData && (
        <button onClick={generatePDF} className="pdf-button">
          Generate PDF
        </button>
      )}
    </div>
  );
};

export default FileUpload;
