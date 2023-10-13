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
    let jsonData = {};
    let success = false;

    //'http://serverIp:Port/Path'
    // 할 것: cors 완벽 해결법, json input 얻기, 
    // 질문: multi-fetch 수행법과 그 결과
    fetch('http://127.0.0.1:8000/summary/security', {
        mode: 'no-cors',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json()).then(response => {
        if(response.success){
            jsonData = response;
            success = true;
        }
        else{
            alert("응답 실패함");
        }
    });
    /*.then(response => console.log(response)) */

    return [jsonData, success];
}

// Outlet이 뭘까? "그림판" 같은 건가?
// 10초를 페이지 상에서 잴 지 아니면 앱 전체에서 재고 데이터 받고 그 데이터 참조해서 진행할지 고르기.
function Representation() {
    
    let [jsonData, success] = Logic(); //10초 후에 Logic 재실행 및 반복.

    useEffect(() => {
        let timer = setInterval(() => {
            [jsonData, success] = Logic();
        }, 10000);

        return () => {clearTimeout(timer)}
    }, [])
    

    if(true){ //success로 바꾸기
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
