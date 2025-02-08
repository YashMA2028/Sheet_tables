import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import InfoBox from "./InfoBox";  // Import the main InfoBox component (which includes InfoBox1 and InfoBox2)
import FileUpload from "./FileUpload"; // Import FileUpload
import Navbar from "./navbar";  // Ensure you have Navbar component correctly imported
import RecordsPage from "./RecordsPage";

function App() {
  const [isDataEntered, setIsDataEntered] = useState(false);

  const handleRegisterClick = () => {
    setIsDataEntered(true);
  };

  return (
    <>
      {/* Always show Navbar in your app */}
      <Navbar />

      <div className="app-container">
        {/* Pass the handleRegisterClick function to InfoBox component */}
        <InfoBox onRegisterClick={handleRegisterClick} />
      </div>

      {/* Conditionally render FileUpload below the boxes and center it */}
      {isDataEntered && (
        <div className="file-upload-section">
          <FileUpload />
        </div>
      )}

      {/* Routes to render pages based on path */}
      <Routes>
        <Route path="/records/:customerId" element={<RecordsPage />} />
      </Routes>
    </>
  );
}

export default App;
