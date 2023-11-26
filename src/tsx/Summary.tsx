//Summary.tsx
//Visualization

import React, { useEffect, useRef, useState } from "react";
import "../css/App.css";
import "../css/Summary.css";
import { Link, Outlet } from "react-router-dom";
import { VscSync, VscShield, VscSearch, VscZoomOut, VscZoomIn } from "react-icons/vsc";
import { Data, JsonData, PodData, PodJsonData, SecurityData, SecurityJsonData } from "./types.tsx";
import data from '../public/data.json';
import data2 from '../public/data2.json';
import data3 from '../public/data3.json';


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

export const Logic = async (callback: (data: JsonData | null) => void) => {
  //callback(null);
    //callback(data);
    
    //'http://serverIp:Port/Path'
    const res: JsonData = await fetch('../public/data.json', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    callback(res);

    const res2: PodJsonData = await fetch('../public/data.json2', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    //console.log(res);
    //console.log(res2);

    const res3: SecurityJsonData = await fetch('../public/data.json2', { // /summary/{edgeid}로 바꾸기.
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());

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

    res2.data.forEach((item: PodData) => {
      const key = `${item.name_space}-${item.name}`;
      curSecurityData.set(key, item);
    });

    res3.data.forEach((item: SecurityData) => {
        const key = `${item.src_pod}-${item.dst_pod}`;
        curSecurityData.set(key, item);
    });

    //callback2(temp);
    return { curPodData, curSecurityData }

}

// export const Logic = async (callback: (data: JsonData | null) => void, podData: Map<any, any>, callback2: (plz: any) => void) => {
//   const res: JsonData = await fetch('/data.json').then(response => response.json());
//   callback(res);

//   const res2 = await fetch('/data2.json').then(response => response.json());

//   const curPodData = podData;
//   res.data.forEach((item: Data) => {
//       curPodData.set(item.src_pod, res2[item.src_pod]);
//       curPodData.set(item.dst_pod, res2[item.dst_pod]);
//   });
// }


export const LogicPod = async (pn: string, callback: (ns_podname: string, pod_data: any) => void) => {
  //callback(null);
  const pod_data = data2["default:A2"]; // data2 바꾸고 이것도 바꾸기!
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
