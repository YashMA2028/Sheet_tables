import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css'; // Importing the CSS file

function FileUploadTable() {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetching data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        setError('Failed to fetch data from the database');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // PDF Generation Function
  const generatePDF = async () => {
    try {
      const element = document.querySelector('.main-container'); // Ensure this selector matches the container with the tables
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

      pdf.save('Consolidate_Report.pdf');
      console.log('PDF successfully generated');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const renderTableForBalanceSheet = () => {
    if (!jsonData || !jsonData.balance_sheet) return <p>No Balance Sheet data available.</p>;

    const years = jsonData.balance_sheet.years;
    const categories = Object.keys(jsonData.balance_sheet).filter((key) => key !== 'years');

    return (
      <div className="table-container">
        <h2 className="table-heading">Balance Sheet</h2>
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
              const categoryData = jsonData.balance_sheet[category];

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

  const renderTableForRatios = () => {
    if (!jsonData || !jsonData.ratios) return <p>No Ratios data available.</p>;

    const years = jsonData.ratios.years;
    const categories = Object.keys(jsonData.ratios).filter((key) => key !== 'years');

    return (
      <div className="table-container">
        <h2 className="table-heading">Ratios</h2>
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
              const categoryData = jsonData.ratios[category];
              const labels = Object.keys(categoryData);

              return (
                <React.Fragment key={category}>
                  <tr>
                    <td colSpan={years.length + 1} className="category-header">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                  </tr>
                  {labels.map((label) => (
                    <tr key={label}>
                      <td>{label}</td>
                      {years.map((year, idx) => (
                        <td key={year}>{categoryData[label][idx]}</td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableForProfitLoss = () => {
    if (!jsonData || !jsonData.profit_loss) return <p>No Profit & Loss data available.</p>;

    const years = jsonData.profit_loss.years;
    const categories = Object.keys(jsonData.profit_loss).filter((key) => key !== 'years');

    return (
      <div className="table-container">
        <h2 className="table-heading">Profit & Loss</h2>
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
              const categoryData = jsonData.profit_loss[category];

              if (Array.isArray(categoryData)) {
                return (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={years.length + 1} className="category-header">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                    </tr>
                    {categoryData.map((value, idx) => (
                      <tr key={idx}>
                        <td>{years[idx]}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={years.length + 1} className="category-header">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                    </tr>
                    {Object.entries(categoryData).map(([label, values]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        {years.map((year, idx) => (
                          <td key={year}>{values[idx]}</td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="main-container">
        {renderTableForRatios()}
        {renderTableForProfitLoss()}
        {renderTableForBalanceSheet()}
      </div>
      <button onClick={generatePDF} className="pdf-button">
        Generate PDF
      </button>
    </div>
  );
}

export default FileUploadTable;
