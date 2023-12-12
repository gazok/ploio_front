//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import "../css/Summary.css";
import { Link, Outlet } from "react-router-dom";
import { Data, JsonData, PodData, PodJsonData, NoticeData, NoticeJsonData } from "./types";
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

export const Logic = async (callback: (packets: JsonData | null) => void, callback2: (data: any) => void, callback3: (data: any) => void) => { // callback2: (ns_podname: string, pod_data: any)

  callback(data);

  const curPodData = new Map();
  const curNoticeData = new Map(); 

  // for(let key in data2) {
  //   const mapkey = `${data2[key].name_space}:${data2[key].name}`;
  //   curPodData.set(mapkey, data2[key]);
  // }
  
  //수정
  for(let key in data2.pods) {
    for(let serverName in data2.pods[key]) {
      curPodData.set(serverName, data2.pods[key][serverName]);
    }
  }

  data3.notices.forEach(item => {
    const mapkey = `${item.src_pod}${item.dst_pod}`;
    curNoticeData.set(mapkey, item);
  });
  
  callback2(curPodData);
  callback3(curNoticeData);

  return;

}


export const LogicPod = async (pn: string, callback: (ns_podname: string, pod_data: any) => void) => {
  //callback(null);
  const pod_data = data2["default:api-server"]; // data2 바꾸고 이것도 바꾸기!
  callback(pn, pod_data);
  //Pod name 보내면 가져오는 식
  /*
    //'http://serverIp:Port/Path'
    const podname: JsonData = await fetch('http://127.0.0.1:8000/summary/tmp', { // /summary/{namespace}/{podname}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());

    console.log(podname);
    callback(podname);
    */
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
