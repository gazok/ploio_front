//Notice.js

import "./App.css";
import "./Notice.css";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import {VscSync, VscShield, VscSearch} from "react-icons/vsc"; //icon 정의

const iconStyle = {
  marginRight: '8px',
  fontSize: '25px', 
}

//Ops, Sec 나누어 알림 볼 수 있도록 함
function NoticeTop() {
  return (
    <div className="notice-top">
      <NavLink to="Operating" activeClassName="active-notice">
        <VscSync style={iconStyle} />
        Operating
      </NavLink>
      <NavLink to="/Security" activeClassName="active-notice">
        <VscShield style={iconStyle} />
        Security
      </NavLink>
    </div>
  );
}


function NoticeMenu() {
  return (
    <div className="notice-menu">
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>
          <VscSearch style={{ Size: '15px', strokeWidth: '2', marginTop: '3px' }} />
         </button>
       </div>
    </div>
  )
}

function Notice() {
  return(
    <div className="content">
      <Router>
        <NoticeTop />
        <NoticeMenu />
      </Router>
    <h3> Notice Page</h3>
    </div>
  )
}

export { NoticeTop, Notice};
