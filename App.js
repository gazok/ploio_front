//App.js
//react-router-dom@5.3.4

import React from "react";
import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
import { SummaryTop, Summary } from "./Summary";
import { NoticeTop, Notice } from "./Notice";
import Profile from "./Profile";
import Setting from "./Setting";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import { VscHome, VscOutput, VscWarning, VscAccount, VscSettingsGear, VscKey, VscSignIn } from "react-icons/vsc"; //icon 정의

const iconStyle = {
  marginRight: '8px',
  fontSize: '25px', 
};

//create menu
function Menubar() {
  return (
    <div className="menu-bar">
      <img alt="App Logo" height="30" src="./logo.png" width="30" />
      <h1 className="text-lg font-medium" style={{ textAlign: "center" }}>
        Ploio
      </h1>
        <NavLink to="/Content" activeClassName="active-menu">
        <VscHome style={iconStyle}/>
        Home
         </NavLink>
        <NavLink to="/Summary" activeClassName="active-menu">
        <VscOutput style={iconStyle} />
        Summary
         </NavLink>
       <NavLink to="/Notice" activeClassName="active-menu" >
        <VscWarning style={iconStyle} />
        Notice
       </NavLink>
       <div className="bottom-items">
         <NavLink to="/Profile" activeClassName="active-menu"> 
          <VscAccount style={iconStyle}/>
          Profile
         </NavLink>
         <NavLink to="/Setting" activeClassName="active-menu">
          <VscSettingsGear style={iconStyle}/>
          Setting
          </NavLink>
      </div>
    </div>
  );
}

//create top-bar
function Top() {
  return (
    <nav className="top-bar">
      <NavLink to="/Login" activeClassName="active-top">
        <VscKey style={iconStyle} />
        Login
      </NavLink>
      <NavLink to="/Signup" activeClassName="active-top">
        <VscSignIn style={iconStyle} />
        Singnup
      </NavLink>
    </nav>
  );
}

//create content frame
function Content() {
  return <main className="content">Welcome to Ploio</main>;
}

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/Summary" component={SummaryTop} />
          <Route path="/Notice" component={NoticeTop} />
          <Route path="/" component={Top} />
          </Switch>
        <Menubar />
        <Switch>
          <Route path="/Login" component={Login} />
          <Route path="/Signup" component={Signup} />
          <Route path="/Summary" component={Summary} />
          <Route path="/Notice" component={Notice} />
          <Route path="/Profile" component={Profile} />
          <Route path="/Setting" component={Setting} />
          <Route path="/" component={Content} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
