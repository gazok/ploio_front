import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tab, TabList, makeStyles } from "@fluentui/react-components";
import { Home32Regular, TextBulletListSquare32Regular, ChatWarning24Regular, PersonCircle32Regular, Settings32Regular, Key32Regular, ShieldKeyhole24Regular, PersonAdd28Regular, DataUsageEdit24Regular } from '@fluentui/react-icons'

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '25px',
};

function CurLocation(path: string) {
  console.log(path);
  if(path=="/") {
    return "tab1";
  }
  else if(path=="/Summary") {
    return "tab2";
  }
  else if(path=="/Notice") {
    return "tab3";
  }
  else if(path=="/Management") {
    return "tab4";
  }
  else if(path=="/Profile") {
    return "tab5";
  }
  else if(path=="/Setting") {
    return "tab6";
  }
  else if(path=="/Signin") {
    return "toptab1";
  }
  else if(path=="/Signup") {
    return "toptab2";
  }
  return "tab2";
}

//create menu
export function Menubar() {
/*
  const [activeButton, setActiveButton] = useState('home'); // Default to 'home'

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <div className="menu-bar">
      <h1 className="text-lg font-medium" style={{ textAlign: "center" }}>
        πλοίο
      </h1>
      <Link to="/" className={` ${activeButton === 'home' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('home')}>
        <VscHome style={iconStyle} />
        Home
      </Link>
      <Link to="/summary" className={` ${activeButton === 'summary' ? 'active-menu' : ''}`} onClick={() => handleButtonClick('summary')}>
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
  */
  
  //icon 바꾸기!
  return (
    <div className="menu-bar">
      <h1 className="text-lg font-medium" style={{ textAlign: "center" }}>
        πλοίο
      </h1>
      <TabList defaultSelectedValue={CurLocation(useLocation().pathname)} size="large" vertical>
        <Link to="/"><Tab value="tab1" icon={<Home32Regular/>} >Home</Tab></Link>
        <div className="menu-summary"><Link to="/Summary"><Tab value="tab2" icon={<TextBulletListSquare32Regular/>}>Summary</Tab></Link></div>
        <Link to="/Notice"><Tab value="tab3" icon={<ChatWarning24Regular/>}>Notice</Tab></Link>
        <div className="menu-management"><Link to="/Management"><Tab value="tab4" icon={<DataUsageEdit24Regular/>}>Management</Tab></Link></div>
        <div className="bottom-items">
          <Link to="/Profile"><Tab value="tab5" icon={<PersonCircle32Regular/>}>Profile</Tab></Link>
          <div className="menu-setting"><Link to="/Setting"><Tab value="tab6" icon={<Settings32Regular/>}>Setting</Tab></Link></div>
        </div>
      </TabList>
      
    </div>
  );
  
}
  
  //create top-bar
  export function Top() {

    const [activeButton, setActiveButton] = useState('home'); // Default to 'home'
    const handleButtonClick = (buttonName: string) => {
      setActiveButton(buttonName);
    };
  
    return (
      <nav className="top-bar">
        <TabList defaultSelectedValue={CurLocation(useLocation().pathname)} size="large">
          <Link to="/Signin"><Tab value="toptab1" icon={<Key32Regular/>} >Sign In</Tab></Link>
          <Link to="/Signup"><Tab value="toptab2" icon={<PersonAdd28Regular/>}>Sign Up</Tab></Link>
        </TabList>
      </nav>
    );
  }

  export function Content() {
    return <main className="content">Welcome to Ploio</main>;
  }