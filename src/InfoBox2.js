import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InfoBox.css"; // Import the common CSS

function InfoBox2() {
  const [customerId, setCustomerId] = useState("");
  const navigate = useNavigate();

  const handleCheckRecords = () => {
    if (!customerId) {
      alert("Please enter a customer ID.");
      return;
    }
    navigate(`/records/${customerId}`);
  };

  return (
    <div className="info-box" id="InfoBox2">
      <input
        type="text"
        id="customerId"
        className="form-control"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        placeholder="Enter Customer Name/ID"
      />
      <button onClick={handleCheckRecords}>Check Records</button>
    </div>
  );
}

export default InfoBox2;
