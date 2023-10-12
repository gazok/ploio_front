//Summary.tsx
//Visualization

import React, { useState } from "react";
import "./App.css";
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

function Logic() {
    const [jsonData, setJsonData] = useState();
    const [success, setSuccess] = useState(false);

    //'http://serverIp:Port/Path'
    // 할 것: cors 완벽 해결법, json input 얻기
    fetch('google/', {
        mode: 'no-cors',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(response => {
        if(response.success){
            setJsonData(response);
            setSuccess(true);
        }
        else{
            alert("응답 실패함");
        }
    });

    return [jsonData, success];
}

// Outlet이 뭘까?
function Representation() {
    let [jsonData, success] = Logic(); //10초 후에 Logic 재실행 및 반복.

    if(success){
        return (<div><Outlet /></div>)
    }
    else{
        return (<div>route B</div>)
    }
}

function Summary() {
  return (
    <div>
      <SummaryTop />
      <SummaryMenu />
      <Representation />
    </div>
  );
}

export default Summary;
