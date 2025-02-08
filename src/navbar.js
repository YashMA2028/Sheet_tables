import React from 'react';
import './navbar.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm mb-4">
      <div className="container-fluid d-flex align-items-center">
        
        <img src="/Logo.jpg" className="img-fluid" alt="Janakalyan Bank" width="75" />
        
        
        <h1><span className="ms-3">Janakalyan Bank</span></h1>
      </div>
    </nav>
  );
}

export default Navbar;
