//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import "../css/Summary.css";
import { Link, Outlet } from "react-router-dom";
import { Data, JsonData, PodData, PodJsonData } from "./types";
import data from '../public/data.json';
import data2 from '../public/data2.json';
import data3 from '../public/data3.json';
import { json } from "d3";

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
        Operation
      </Link>
    </nav>
  );/*<Link to="Security" className={` ${activeButton === 'security' ? 'active-summary' : ''}`} onClick={() => handleButtonClick('security')}>
  <VscShield style={iconStyle} />
  Security
</Link>*/
}

export const Logic = async (callback: (data: JsonData | null) => void, callback2: (data: any) => void, callback3: (data: any) => void) => { // callback2: (ns_podname: string, pod_data: any)
  /*
  const res: JsonData = await fetch('http://3.25.167.109:80/summary/operation', { // /summary/{edgeid}로 바꾸기.
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());
  callback(res);*/
  callback(data);

  /*
  //2
  const res2 = await fetch('http://3.25.167.109:80/summary/pods', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());
  
  const curPodData = new Map();
  for(let key in res2.pods) {
    const mapkey = `${res2.pods[key].name_space}:${res2.pods[key].name}`;
    curPodData.set(mapkey, res2.pods[key]);
  }
  callback2(curPodData);*/
  
  const curPodData = new Map();
  for(let key in data2.pods) {
    for(let serverName in data2.pods[key]) {
      curPodData.set(serverName, data2.pods[key][serverName]);
    }
  }
  callback2(curPodData);

  /*
  //3
  const res3 = await fetch('http://3.25.167.109:80/notice', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());

  const curNoticeData = new Map(); 
  res3.notices.forEach(item => {
    const mapkey = `${item.src_pod}-${item.dst_pod}`;
    curNoticeData.set(mapkey, item);
  });
  callback3(curNoticeData);*/
  
  const curNoticeData = new Map(); 
  data3.notices.forEach(item => {
    const mapkey = `${item.src_pod}-${item.dst_pod}`;
    curNoticeData.set(mapkey, item);
  });
  callback3(curNoticeData);

  return;
}

function Summary() {
  return (
    <div>
      <SummaryTop />
      <Outlet />
    </div>
  );
}

export default Summary;
