//App.tsx
//메뉴바, 상단바 등 app의 일관된 부분 구현

import React, { useState } from "react";
import "./App.css";
import { Link } from "react-router-dom"; // Correct import statement
import { VscHome, VscOutput, VscWarning, VscAccount, VscSettingsGear, VscKey, VscSignIn } from "react-icons/vsc";

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '25px',
};

function Menubar() {

  const [activeButton, setActiveButton] = useState('home'); // Default to 'home'

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <div className="menu-bar">
      <img alt="App Logo" height="30" src="./logo.png" width="30" />
      <h1 className="text-lg font-medium" style={{ textAlign: "center" }}>
        Ploio
      </h1>
      <Link to="/" className={` ${activeButton === 'home' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('home')}>
        <VscHome style={iconStyle} />
        Home
      </Link>
      <Link to="/Summary" className={` ${activeButton === 'summary' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('summary')}>
        <VscOutput style={iconStyle} />
        Summary
      </Link>
      <Link to="/Notice" className={` ${activeButton === 'notice' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('notice')}>
        <VscWarning style={iconStyle} />
        Notice
      </Link>
      <div className="bottom-items">
        <Link to="/Profile" className={` ${activeButton === 'profile' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('profile')}>
          <VscAccount style={iconStyle} />
          Profile
        </Link>
        <Link to="/Setting" className={` ${activeButton === 'setting' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('setting')}>
          <VscSettingsGear style={iconStyle} />
          Setting
        </Link>
      </div>
    </div>
  );
}

function Top() {

  const [activeButton, setActiveButton] = useState('home'); // Default to 'home'
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <nav className="top-bar">
      <Link to="/Login" className={` ${activeButton === 'login' ? 'active-top' : ''}`} onClick={() => handleButtonClick('login')}>
        <VscKey style={iconStyle} />
        Login
      </Link>
      <Link to="/Signup" className={` ${activeButton === 'signup' ? 'active-top' : ''}`} onClick={() => handleButtonClick('signup')}>
        <VscSignIn style={iconStyle} />
        Signup
      </Link>
    </nav>
  );
}

function Content() {
  return <main className="content">Welcome to Ploio</main>;
}

export { Top, Menubar, Content };
