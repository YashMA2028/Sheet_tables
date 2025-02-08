import React from "react";
import "./InfoBox.css";

function InfoBox1({ onRegisterClick }) {
  return (
    <div className="info-box" id="InfoBox1">
      <h1>Enter the excel sheet from the MCA website</h1>
      <button onClick={onRegisterClick}>Enter the Data</button>
    </div>
  );
}

export default InfoBox1;
