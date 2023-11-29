//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import "../css/Summary.css";
import { Link, Outlet } from "react-router-dom";
import { Data, JsonData, PodData, PodJsonData, SecurityData, SecurityJsonData } from "./types";
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
    //callback(null);
    //callback(data);
    
    callback(data);

   

  //const temp: PodData[] = [];
  // const curPodData = podData;
  const curPodData = new Map();
  const curSecurityData = new Map(); 
  // res.data.forEach((item: Data) => {
  //     //console.log(res2[item.src_pod]);
  //     //temp.push(res2[item.src_pod]);
  //     //temp.push(res2[item.dst_pod]);

  //     curPodData.set(item.src_pod, res2[item.src_pod]);
  //     curPodData.set(item.dst_pod, res2[item.dst_pod]);
  // });

  for(let key in data2) {
    const mapkey = `${data2[key].name_space}:${data2[key].name}`;
    curPodData.set(mapkey, data2[key]);
  }

  data3.sec_data.forEach(item => {
    const mapkey = `${item.src_pod}-${item.dst_pod}`;
    curSecurityData.set(mapkey, item);
  });
  
  callback2(curPodData);
  callback3(curSecurityData);

  return;

    /*
    const res: JsonData = await fetch('http://123.108.168.190:8000/summary/tmp/log_data.json', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    callback(res);

    const res2 = await fetch('http://123.108.168.190:8000/summary/tmp/pod_data.json', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    //console.log(res);
    //console.log(res2);

    //const temp: PodData[] = [];
    const curPodData = podData;
    res.data.forEach((item: Data) => {
        //console.log(res2[item.src_pod]);
        //temp.push(res2[item.src_pod]);
        //temp.push(res2[item.dst_pod]);

        curPodData.set(item.src_pod, res2[item.src_pod]);
        curPodData.set(item.dst_pod, res2[item.dst_pod]);
    });
    //callback2(temp);
    */

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
