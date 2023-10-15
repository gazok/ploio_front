//Summary.tsx
//Visualization

import React, { useEffect, useState } from "react";
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
    let jsonData = {"data": []};
    let success = false;

    //'http://serverIp:Port/Path'
    // 할 것: json input 얻기, 
    fetch('http://127.0.0.1:8000/summary/tmp', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
        if(response.ok){
            //alert("응답 성공함");
            success = true;
        }
        else{
            //alert("응답 실패함");
            success = false;
        }
        return response.json();}).then(response => {
        if(success){
            alert("응답 성공함");
            jsonData = response;
            
            
            let p1 = document.getElementById("ptest1");
            if(p1){
                p1.innerHTML = JSON.stringify(jsonData);
                //p1.innerHTML = JSON.stringify(jsonData.data[1]);
            }
            console.log(jsonData);
        }
        else{
            alert("응답 실패함");
        }
    });
    /*.then(response => console.log(response)) */
    //console.log(jsonData);
    //console.log(success); //false
    return {jsonData, success}; //Ignore this. This doesn't work well.
}

// Outlet이 뭘까?
function Representation() {
    let {jsonData, success} = Logic(); //10초 후에 Logic 재실행 및 반복.
    //console.log(jsonData);

    useEffect(() => {
        let timer = setInterval(() => {
            let {jsonData, success} = Logic();
        }, 10000);

        return () => {clearTimeout(timer)};
    }, []);
    
    if(true){ //success로 바꾸기?
        //return (<div><Outlet /></div>)
        return (<div><p id="ptest1"></p></div>);
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
