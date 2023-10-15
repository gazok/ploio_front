//Operation.tsx
//Ops 부문 가시화
//수정 중

import React, { useState } from 'react';
import { XYPlot, MarkSeries, LineSeries } from 'react-vis';
import data from '../data.json';
import '../App.css';
import './Summary.css';
import { VscExport } from 'react-icons/vsc';

// 데이터 형식 정의
interface Data {
  src_ip: string;
  src_port: number;
  dst_ip: string;
  dst_port: number;
  data_len: number;
  protocol: string;
}

const Operation: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const podData: Data[] = data;

  // 노드 위치 및 색상을 관리하는 상태 추가
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [nodeColors, setNodeColors] = useState<{ [key: string]: string }>({});

  const nodeGroups: { [key: string]: number } = {}; // 같은 src를 가진 것끼리 묶음
  const nodes: { x: number; y: number; name: string; size: number }[] = [];
  const links: { source: string; target: string }[] = [];

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // 그래프의 크기 설정
  const graphWidth = 1300;
  const graphHeight = 610;

  for (const pod of podData) {
    const nodeKey = `${pod.src_ip}:${pod.src_port}`;
    if (!nodePositions[nodeKey]) { //노드 위치 고정
      const position = {
        x: Math.random() * graphWidth*3,
        y: Math.random() * graphHeight,
      };
      setNodePositions((prevPositions) => ({ ...prevPositions, [nodeKey]: position }));

      if (!nodeColors[nodeKey]) { //노드 색상 고정
        const color = getRandomColor();
        setNodeColors((prevColors) => ({ ...prevColors, [nodeKey]: color }));
      }
    }
    if (nodeGroups[nodeKey]) {
      nodeGroups[nodeKey]++;
    } else {
      nodeGroups[nodeKey] = 1;
    }

    const position = nodePositions[nodeKey];
    if (position) { // 노드 존재하는지 확인
      nodes.push({
        x: position.x,
        y: position.y,
        name: nodeKey,
        size: nodeGroups[nodeKey] * 10,
      });
    }

    // 간선 그리기
    const targetNodeKey = `${pod.dst_ip}:${pod.dst_port}`;
    const targetPosition = nodePositions[targetNodeKey];
    if (targetPosition) { // target이 존재하는지 확인
      nodes.push({
        x: targetPosition.x,
        y: targetPosition.y,
        name: targetNodeKey,
        size: nodeGroups[targetNodeKey] * 10,
      });
      links.push({ source: nodeKey, target: targetNodeKey });
    }
  }

  // 뷰포트
  const [viewport, setViewport] = useState({ 
    x: 0,
    y: 0,
  });
  
  // 마우스 드래그 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { 
      const dx = e.movementX;
      const dy = e.movementY;
  
      setViewport((prevViewport) => ({
        x: prevViewport.x - dx,
        y: prevViewport.y + dy, 
      }));
    }
  };

  // 파드(원) 클릭 핸들러
  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    setSelectedPod(`${pod.name}\nsrc_ip: ${pod.name.split(':')[0]}\nsrc_port: ${pod.name.split(':')[1]}`);
    setSelectedEdge(null);
    setShowInfo(true);
  };

  //간선(화살표) 클릭 핸들러
  const handleArrowClick = (sourcePod: string, destPod: string) => {
    setSelectedPod(`Communication from ${sourcePod} to ${destPod}`);
    const edgeData = findEdgeData(sourcePod, destPod);
    setSelectedEdge(
      `dst_ip: ${edgeData.dst_ip}\ndst_port: ${edgeData.dst_port}\ndata_len: ${edgeData.data_len}\nprotocol: ${edgeData.protocol}`
    );
    setShowInfo(true);
  };

  //통신 노드 찾기 
  const findEdgeData = (sourcePod: string, destPod: string) => {
    const edgeData = podData.find(
      (pod) =>
        `${pod.src_ip}:${pod.src_port}` === sourcePod &&
        `${pod.dst_ip}:${pod.dst_port}` === destPod
    );
    return edgeData || { dst_ip: '', dst_port: '', data_len: '', protocol: '' };
  };

  //원 그리기
  const renderMarkSeries = () => {
    return nodes.map((node) => (
      <MarkSeries
        key={node.name}
        data={[node]}
        fill={nodeColors[node.name]} // 노드의 색상 사용
        stroke="none"
        sizeRange={[0, 100]}
        onValueClick={() => handlePodClick(node)}
      />
    ));
  };

  //간선 그리기
  const renderLineSeries = () => {
    return links.map((link, index) => (
      <LineSeries
        key={index}
        data={[
          nodes.find((n) => n.name === link.source)!,
          nodes.find((n) => n.name === link.target)!,
        ]}
        onValueClick={() => handleArrowClick(link.source, link.target)}
        stroke={10}
      />
    ));
  };

  return (
    <div className='content' onMouseMove={handleMouseMove}>
        <XYPlot width={graphWidth} height={graphHeight} style={{ marginTop: '30px' }} xDomain={[viewport.x, viewport.x + 3000]} yDomain={[viewport.y, viewport.y + 610]}>
          {renderMarkSeries()}
          {renderLineSeries()}
        </XYPlot>
        {showInfo && (
          <div className='info-box'>
            <div className='info-content'>
              <button onClick={() => setShowInfo(false)} className='info-top'>
                <b>Details</b>
                <VscExport />
              </button>
              <p className='metadata'>{selectedPod}</p>
              {selectedEdge && <p className='metadata'>{selectedEdge}</p>}
            </div>
          </div>
        )}
    </div>
  );
};

export default Operation;
