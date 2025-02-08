import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./RecordsPage.css";

function RecordsPage() {
  const { customerId } = useParams();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch records based on customerId
    fetch(`http://localhost:5000/get_user_records/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecords(data); // If records found, update state
        } else {
          setError(data.message || "No records found.");
        }
      })
      .catch(() => setError("Error fetching records."));
  }, [customerId]);

  // Render table logic
  const renderTable = useCallback((data, title) => {
    if (!data || !data.years) return <p>No {title} data available.</p>;
  
    const years = data.years;
    const categories = Object.keys(data).filter((key) => key !== "years");
  
    return (
      <div className="table-container">
        <h2 className="table-heading">{title}</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th className="text-left">Category / Label</th>
              {years.map((year) => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const categoryData = data[category];
              if (typeof categoryData === "object") {
                return (
                  <React.Fragment key={category}>
                    <tr>
                      <td colSpan={years.length + 1} className="category-header">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </td>
                    </tr>
                    {Object.entries(categoryData).map(([subcategory, values]) => (
                      <tr key={subcategory}>
                        <td className="text-left">{subcategory}</td>
                        {years.map((year, idx) => (
                          <td key={year}>
                            <input
                              type="text"
                              id={`${category}-${subcategory}-${year}`}
                              name={`${category}-${subcategory}`}
                              value={
                                values && Array.isArray(values) && values[idx] !== undefined
                                  ? values[idx]
                                  : ""
                              }
                              placeholder="Enter value"
                              disabled // Disable the input field
                              aria-label={`View ${subcategory} for year ${year}`}
                            />
                          </td>
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
  }, []);
  

  return (
    <div className="records-page">
      <h1>Records for {customerId}</h1>

      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display records if available */}
      {records.length > 0 ? (
        <div className="records-list">
          {records.map((record, index) => (
            <div key={index} className="record-item">
              <h3>Record {index + 1}</h3>
              <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>

              {/* Render Balance Sheet, Ratios, and Profit/Loss tables */}
              {renderTable(record.data.balance_sheet, "Balance Sheet")}
              {renderTable(record.data.ratios, "Ratios")}
              {renderTable(record.data.profit_loss, "Profit & Loss")}
            </div>
          ))}
        </div>
      ) : (
        <p>No records found for this customer.</p>
      )}
    </div>
  );
}

export default RecordsPage;
