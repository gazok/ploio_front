//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "./Summary.css";
import { Link, Outlet } from "react-router-dom";
import { VscSync, VscShield, VscSearch, VscZoomOut } from "react-icons/vsc";

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '25px',
};

interface Data {
    src_ip: string;
    src_port: number;
    dst_ip: string;
    dst_port: number;
    data_len: number;
    protocol: string;
}

interface JsonData {
    data: Data[];
}

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

const Logic = async (callback: (data: JsonData | null) => void) => {
    //'http://serverIp:Port/Path'
    const res: JsonData = await fetch('http://127.0.0.1:8000/summary/tmp', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());

    console.log(res);
    callback(res);
}

// Outlet이 뭘까?
function Representation() {
    const [tdata, setTdata] = useState<JsonData | null>(null);
    
    useEffect(() => {
        Logic(res => setTdata(res));
        let timer = setInterval(() => {
            Logic(res => setTdata(res));
        }, 10000);

        return () => {clearTimeout(timer)};
    }, []);
    
    //console.log(tdata);
    if(true){ //success로 바꾸기?
        //return (<div><Outlet /></div>)
        return (<div><Outlet /><p id="ptest1">{tdata && JSON.stringify(tdata.data[1])}</p></div>);
    }
    else{
        return (<div>route B</div>);
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
