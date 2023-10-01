//Security.js

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./App.css";
import "./Summary.css";

function Security() {
  const history = useHistory();
  const [showCircles, setShowCircles] = useState(true);
  const [showInfo, setShowInfo] = useState(false); // 선을 클릭했을 때 창을 보여주는 상태

  // Service 1
  const rect1X = 150; // X 좌표
  const rect1Y = 250; // Y 좌표
  const rect1Width = 200; // 너비
  const rect1Height = 150; // 높이

  // Service 2
  const rect2X = 800; 
  const rect2Y = 250; 
  const rect2Width = 200; 
  const rect2Height = 150; 

  // 화살표를 그리기 위한 거리 및 각도 계산
  const distance = Math.abs(rect2X - rect1X);
  const angle = Math.atan(rect2Height / distance);

  // 선을 클릭했을 때 창 토글
  const handleLineClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="content">
      {showCircles && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {/* Service1 */}
          <rect className="fill-lightblue" x={rect1X} y={rect1Y} width={rect1Width} height={rect1Height} />

          {/* Service2 */}
          <rect className="fill-lightcoral" x={rect2X} y={rect2Y} width={rect2Width} height={rect2Height} />

          {/* 화살표*/}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="30"
              markerHeight="30"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon fill="gray" points="0 0, 5 3.5, 0 7" />
            </marker>
          </defs>

          <line
            x1={rect1X + rect1Width}
            y1={rect1Y + rect1Height / 2}
            x2={rect2X -50}
            y2={rect2Y + rect2Height / 2}
            className="line-style" // CSS 클래스 적용
            markerEnd="url(#arrowhead)"
            onClick={handleLineClick}
          />
        </svg>
      )}
      
      {/*화살표 클릭 시 상세 정보 확인 가능하도록 창 띄움*/}
      {showInfo && (
        <div className="info-box">
          <div className="info-content">
          <button onClick={handleLineClick} className="info-top">
            {/*닫기 버튼*/}
            <svg
              fill="full"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="-1 0 25 25"
              width="13"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 3.795l2.995-2.98 11.132 11.185-11.132 11.186-2.995-2.981 8.167-8.205-8.167-8.205zm18.04 8.205l-8.167 8.205 2.995 2.98 11.132-11.185-11.132-11.186-2.995 2.98 8.167 8.206z"
              />
            </svg>
            <b>Details</b>
          </button>
            {/* 내용 */}
            <p>정보 창</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;
