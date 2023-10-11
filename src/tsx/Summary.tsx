//Summary.tsx
//Visualization

import React, { useState } from "react";
import "../App.css";
import "./Summary.css";
import { Link, Outlet } from "react-router-dom";
import { VscSync, VscShield, VscSearch, VscZoomOut } from "react-icons/vsc";

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '25px',
};

function SummaryTop() {
  const [activeButton, setActiveButton] = useState('operation'); // Default to 'home'
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <nav className="summary-top">
      <Link to="Operation" className={` ${activeButton === 'operation' ? 'active-summary' : ''}`} onClick={() => handleButtonClick('operation')}>
        <VscSync style={iconStyle} />
        Operation
      </Link>
      <Link to="Security" className={` ${activeButton === 'security' ? 'active-summary' : ''}`} onClick={() => handleButtonClick('security')}>
        <VscShield style={iconStyle} />
        Security
      </Link>
    </nav>
  );
}

function SummaryMenu() {
  return (
    <div className="summary-menu">
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>
          <VscSearch style={{ fontSize: '15px', strokeWidth: 2, marginTop: '3px' }} />
        </button>
        <button style={{ marginLeft: '10px' }}>
          <VscZoomOut />
          Min
        </button>
      </div>
    </div>
  );
}

function Summary() {
  return (
    <div>
      <SummaryTop />
      <SummaryMenu />
      <Outlet />
    </div>
  );
}

export default Summary;
