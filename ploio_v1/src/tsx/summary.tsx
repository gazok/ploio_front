//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import "../css/Summary.css";
import { Link, Outlet } from "react-router-dom";
import { VscSync, VscShield, VscSearch, VscZoomOut, VscZoomIn } from "react-icons/vsc";
import { Data, JsonData } from "./types";
import data from '../public/data.json'

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

export const Logic = async (callback: (data: JsonData | null) => void) => {
    callback(null);
    callback(data);
    /*
    //'http://serverIp:Port/Path'
    const res: JsonData = await fetch('http://127.0.0.1:8000/summary/tmp', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());

    console.log(res);
    callback(res);
    */
}

export const LogicPod = async (callback: (data: JsonData | null) => void) => {
  callback(null);
  callback(data);
  //Pod name 보내면 가져오는 식
}


function Summary() {
  return (
    <div>
      <SummaryTop />
      <Outlet />
    </div>
  );
}

export default Summary;
