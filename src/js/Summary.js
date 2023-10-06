//Summary.js

import React, { useState } from "react";
import "./App.css";
import "./Summary.css";
import Security from "./Security";
import Operating from "./Operating";
import { BrowserRouter as Router, Route, Switch, NavLink } from "react-router-dom";
import {VscSync, VscShield, VscSearch, VscZoomOut} from "react-icons/vsc";

const iconStyle = {
  marginRight: '8px',
  fontSize: '25px', // 아이콘 크기 설정
};

function SummaryTop() {
  return (
    <div className="summary-top">
      <NavLink to="Operating" activeClassName="active-summary">
        <VscSync style={iconStyle} />
        Operating
      </NavLink>
      <NavLink to="/Security" activeClassName="active-summary">
        <VscShield style={iconStyle} />
        Security
      </NavLink>
    </div>
  );
}

function SummaryMenu() {
  return (
    <div className="summary-menu">
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>
          <VscSearch style={{ Size: '15px', strokeWidth: '2', marginTop: '3px' }} />
         </button>
         <button style={{marginLeft: '10px'}}>
           <VscZoomOut />
           Min
         </button>
       </div>
    </div>
  )
}

function Summary() {
  return (
      <Router>
        <SummaryTop /> 
        <SummaryMenu />
        <Switch>
          <Route path="/Security" component={Security} />
          <Route path="/" component={Operating} />
        </Switch>
      </Router>
  );
}

export { SummaryTop, Summary };
