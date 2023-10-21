//Notice.tsx
//1차 발표 이후 보완 예정


import React, {useState} from 'react';
import "../css/App.css";
import "../css/Notice.css";
import { Link, Outlet } from "react-router-dom";
import { VscSync, VscShield, VscSearch } from "react-icons/vsc"; //icon

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '25px',
};

function NoticeTop() {
  const [activeButton, setActiveButton] = useState('nops'); // Default to 'nops'
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <nav className="notice-top">
      <Link to="NOps" className={` ${activeButton === 'nops' ? 'active-notice' : ''}`} onClick={() => handleButtonClick('nops')}> 
        <VscSync style={iconStyle} />
        Operation
      </Link>
      <Link to="NSec" className={` ${activeButton === 'nsec' ? 'active-notice' : ''}`} onClick={() => handleButtonClick('nsec')}>
        <VscShield style={iconStyle} />
        Security
      </Link>
    </nav>
  );
}

function NoticeMenu() {
  return (
    <div className="notice-menu">
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>
          <VscSearch style={{ fontSize: '15px', strokeWidth: '2', marginTop: '3px' }} />
        </button>
      </div>
    </div>
  );
}

function Notice() {
  return (
    <div>
      <NoticeTop />
      <NoticeMenu />
      <Outlet /> {/*Operation, Security 라우팅*/}
    </div>
  );
}

export default Notice;
