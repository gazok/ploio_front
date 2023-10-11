//Operating.js
//수정중

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./App.css";
import "./Summary.css";

//트래픽 가시화 구현
function Operating() {
  const history = useHistory();
  const [showCircles, setShowCircles] = useState(true);
  const [showInfo, setShowInfo] = useState(false); // 선을 클릭했을 때 창을 보여주는 상태

  // Service 1
  const circle1X = 300; // 원의 중심 X 좌표
  const circle1Y = 300; // 원의 중심 Y 좌표
  const circle1Radius = 250; // 원의 반지름

  // Service 2
  const circle2X = 1000;
  const circle2Y = 400;
  const circle2Radius = 200;

  // Service 1의 Subpath
  const circle3X = circle1X + 100;
  const circle3Y = circle1Y - 80;
  const circle3Radius = 70;

  // Service 2의 Subpath
  const circle4X = circle2X + 120;
  const circle4Y = circle2Y - 30;
  const circle4Radius = 60;

  // 화살표를 그리기 위한 거리 및 각도 계산
  const distance = Math.sqrt(
    Math.pow(circle4X - circle3X, 2) + Math.pow(circle4Y - circle3Y, 2)
  );
  const angle = Math.asin((circle4Y - circle3Y) / distance);

  // 선을 클릭했을 때 창을 토글하는 함수
  const handleLineClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <main className="content">
      {showCircles && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {/* Service 1 */}
          <circle className="fill-lightblue" cx={circle1X} cy={circle1Y} r={circle1Radius} />

          {/* Service 2 */}
          <circle className="fill-lightcoral" cx={circle2X} cy={circle2Y} r={circle2Radius} />

          <circle className="fill-white" cx={circle3X} cy={circle3Y} r={circle3Radius} />

          <circle className="fill-white" cx={circle4X} cy={circle4Y} r={circle4Radius} />

          {/* 화살표*/}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="20"
              markerHeight="20"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon fill="gray" points="0 0, 5 3.5, 0 7" />
            </marker>
          </defs>

          <line
            x1={circle3X + circle3Radius * Math.cos(angle)}
            y1={circle3Y + circle3Radius * Math.sin(angle)}
            x2={circle4X - circle4Radius * Math.cos(angle) - 50}
            y2={circle4Y - circle4Radius * Math.sin(angle) - 20}
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
    </main>
  );
}

export default Operating;
