import React from "react";
import InfoBox1 from "./InfoBox1";
import InfoBox2 from "./InfoBox2";
import "./InfoBox.css"; // Import the common CSS

function InfoBox({ onRegisterClick }) {
  return (
    <div className="info-box-container">
      {/* First Box: Excel Sheet Upload */}
      <InfoBox1 onRegisterClick={onRegisterClick} />

      {/* Second Box: Customer ID Input */}
      <InfoBox2 />
    </div>
  );
}

export default InfoBox;
