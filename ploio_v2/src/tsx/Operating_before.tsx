/*
//Operation.tsx
//Ops 부문 가시화
//수정 중 

import React, { useState, useEffect } from 'react';
import { XYPlot, MarkSeries, LineSeries, LabelSeries  } from 'react-vis';
import "../css/App.css";
import '../css/Summary.css';
import { VscExport, VscCircleSmall, VscSearch, VscZoomOut, VscZoomIn } from 'react-icons/vsc';
import { Logic } from './summary';
import { Data, JsonData, PodData } from './types';
//import data from'../public/data.json';
//import { relative } from 'path';

//useEffect 10초 용도
const [podStart, setPodStart] = useState(0);

const Operation: React.FC = () => {
  // UI 요소 관리를 위한 상태
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<JSX.Element | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<JSX.Element | null>(null);

  // 노드 위치, 색상 및 데이터 관리를 위한 상태
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  // const [nodeColors, setNodeColors] = useState<{ [key: string]: string }>({});
  const [nodes, setNodes] = useState<{ x: number; y: number; name: string; size: number }[]>([]);
  const [links, setLinks] = useState<{ source: string; target: string }[]>([]);
  const [groupedNodes, setGroupedNodes] = useState<{ [key: string]: number }>({});

  // data.json 데이터 로드
  const [tdata, setTdata] = useState<JsonData | null>(null); //json 받는 컨테이너
  const [linkData, setLinkData] = useState<Data[] | null>(null); // src, dst, data_len
  let nodeData: PodData[] = []; // 포드들의 실제 데이터 모임

  // 그래프 크기 정의
  const graphWidth = 1300;
  const graphHeight = 610;
  const [ratio, setRatio] = useState(1);


  useEffect(() => {
    Logic(res => setTdata(res));
    //console.log(tdata);
    let timer = setInterval(() => {
      Logic(res => setTdata(res));
      //console.log(tdata);
    }, 1000);

    // 타이머 클리어 (for setInterval)
    return () => {clearTimeout(timer)};
  }, []);

  useEffect(() => {
    console.log(tdata);
    if(tdata){
      setLinkData(tdata.data); // 받아온 데이터 리스트 집어넣기.
    }
    else{
      return;
    }

    //노드 및 간선 및 텍스트 생성 변수
    const groupedNodes: { [key: string]: number } = {};
    const newNodes: { x: number; y: number; name: string; size: number }[] = [];
    //const textNodes: { text: string; }[] = [];
    const newLinks: { source: string; target: string }[] = [];
    //const textLinks: { text: string; }[] = [];

    //노드 생성 함수
    const createNode = (PodKey: string) => {
      const padding = 100; 
      const position = {
        x: Math.random() * graphWidth * 3 + padding,
        y: Math.random() * graphHeight + padding,
      };
    
      groupedNodes[PodKey] = 1;
    
      if (!nodePositions[PodKey]) {
        setNodePositions((nodePositions) => ({ ...nodePositions, [PodKey]: position }));
        setGroupedNodes((groupedNodes) => ({ ...groupedNodes, [PodKey]: groupedNodes[PodKey] + 1 }));
      }
    
      return {
        x: position.x,
        y: position.y,
        name: PodKey,
        size: 25,
      };
    };

    linkData?.forEach((pod) => {
      const srcNodeKey = `${pod.src_pod}`;
      const targetNodeKey = `${pod.dst_pod}`;
    
      //src 노드가 존재하지 않으면 생성
      if (!groupedNodes[srcNodeKey]) {
        newNodes.push(createNode(srcNodeKey)); // 여기 안에서 포드 관련 작업 다하기.
      }else{
        groupedNodes[srcNodeKey]++ // 이건 뭐에요?
      }
    
      //dst 노드가 존재하지 않으면 생성
      if (!groupedNodes[targetNodeKey]) {
        newNodes.push(createNode(targetNodeKey));
      }else{
        groupedNodes[targetNodeKey]++
      }
    
      newLinks.push({ source: srcNodeKey, target: targetNodeKey });
    });

    //노드의 원형 배열
    const angleStep = (2 * Math.PI) / newNodes.length ;
    const horizontalRadius = 1200; 
    const verticalRadius = 300;   
    const centerX = graphWidth / 2;
    const centerY = graphHeight / 2;

    const circleNodes = newNodes.map((node, i) => ({
      x: centerX + horizontalRadius * Math.cos(i * angleStep),
      y: centerY + verticalRadius * Math.sin(i * angleStep),
      name: node.name,
      size: node.size,
    }));

    setNodes(circleNodes);
    setLinks(newLinks);
  }, [tdata, nodePositions]); //end of useEffect

  function MBar() {
    return (
      <div className="summary-menu">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <button>
            <VscSearch style={{ fontSize: '15px', strokeWidth: 2, marginTop: '3px' }} />
          </button>
          <button style={{ marginLeft: '10px' }} onClick={handleZoomIn}>
            <VscZoomIn />
          </button>
          <button style={{ marginLeft: '10px' }} onClick={handleZoomOut}>
            <VscZoomOut></VscZoomOut>
          </button>
        </div>
      </div>
    );
  }
  // 노드 데이터 검색
  const findNodeData = (PodKey: string) => {
    const NodeData = nodes.find(
      (node) =>
        node.name === PodKey
    );
    return NodeData || { x: 0, y: 0, name: '', size: 0 };
  };

  // 엣지 데이터 검색
  const findEdgeData = (sourcePod: string, destPod: string) => {
    const edgeData = linkData?.find(
      (pod) =>
        `${pod.src_pod}` === sourcePod &&
        `${pod.dst_pod}` === destPod
    );
    return edgeData || { dst_pod: '', data_len: '' };
        // return edgeData || { dst_ip: '', dst_port: '', data_len: '', protocol: '', timestamp: '' };
  };

  // 노드 렌더링
  const renderMarkSeries = () => {
    return nodes.map((node) => (
        <MarkSeries
          key={node.name}
          data={[node]}
          className="node"
          fill="white"
          stroke="green" //우선 초록색으로 해놨습니다
          strokeWidth={5}
          sizeRange={[0, (groupedNodes[node.name] || 1) * 25]}
          onValueClick={() => handlePodClick(node)}
          />
     ));
   };

  // 엣지 렌더링
  const renderLineSeries = () => {
    return links.map((link, index) => (
      <LineSeries
        key={index}
        data={[
          nodes.find((n) => n.name === link.source)!,
          nodes.find((n) => n.name === link.target)!,
        ]}
        style={{stroke: 'lightgray', strokeWidth: 3 }} 
        onSeriesClick={() => handleEdgeClick(link)} 
      /> 
    ));
  };
  
  // ip:port 라벨 렌더링
  const renderNodeLabelSeries = () => {
    return nodes.map((node) => {
      const x = node.x;
      const y = node.y;
      const label = node.name;
      const l = { x: node.x, y: node.y, label: label, xOffset: 0, yOffset: 15 };

      return (
        <LabelSeries
          data={[l]}
        />
      );
    });
  }

  // datalen 라벨 렌더링
  const renderLinkLabelSeries = () => {
    return links.map((link, index) => {
      const edgeData = findEdgeData(link.source, link.target);
      const label = String(edgeData.data_len);
      const node1 = findNodeData(link.source);
      const node2 = findNodeData(link.target);
      const l = { x: (node1.x && node2.x && (node1.x + node2.x) / 2), y: (node1.y && node2.y && (node1.y + node2.y) / 2), label: label, xOffset: 0, yOffset: 0 };

      return (
        <LabelSeries
          data={[l]}
        />
      );
    });
  }
  
  // 뷰포트 상태 업데이트
  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
  });

  // 마우스 이동 핸들러
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

  const handleWheelMove = (e: React.WheelEvent) => {
      const dr = e.deltaY; //아래로 굴리면 양수

      setRatio((prevRatio) => (
        prevRatio + 0.001 * dr >= 0.2 ? (prevRatio <= 3.6 ? prevRatio + 0.001 * dr : 3.6) : 0.2
      ));
  };

  const handleZoomIn = () => {
    const dr = 0.2; //아래로 굴리면 양수

    setRatio((prevRatio) => (
      prevRatio + dr <= 3.6 ? prevRatio + dr : 3.6
    ));
  };
  
  const handleZoomOut = () => {
    const dr = -0.2; //아래로 굴리면 양수

    setRatio((prevRatio) => (
      prevRatio + dr >= 0.2 ? prevRatio + dr : 0.2
    ));
  };

  // 노드 클릭 핸들러
  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    setSelectedPod(
      <div>
        <h3>Pod Information</h3>
        <p>
          <VscCircleSmall /> name: {pod.name.split(':')[0]} <br />
          {/* <VscCircleSmall /> Port: {pod.name.split(':')[1]}{' '} }
        </p>
      </div>
    );
    setSelectedEdge(null);
    setShowInfo(true);
  };

  // 엣지 클릭 핸들러
  const handleEdgeClick = (edge: { source: string; target: string }) => {
    const edgeData = findEdgeData(edge.source, edge.target);
    setSelectedEdge(
      <div>
        <h3>Communication Information</h3>
        <p>
          <VscCircleSmall /> Communication {edge.source} to {edge.target} <br />
          <VscCircleSmall /> DstPod Name: {edgeData.dst_pod} <br />
          {/* <VscCircleSmall /> Dst IP: {edgeData.dst_ip} <br />
          <VscCircleSmall /> Dst Port: {edgeData.dst_port} <br /> }
          <VscCircleSmall /> Data length: {edgeData.data_len} <br />
          {/* <VscCircleSmall /> Protocol: {edgeData.protocol} <br />
          <VscCircleSmall /> Timestamp: {edgeData.timestamp}{' '} }
        </p>
      </div>
    );
    setSelectedPod(null);
    setShowInfo(true);
  };
  
  return (
    <div>
      <MBar />
    <div className='content' onMouseMove={handleMouseMove} onWheel={handleWheelMove}>
      <XYPlot
        width={graphWidth / ratio}
        height={graphHeight / ratio}
        style={{ marginTop: '40px', position: 'relative', transform: `scale(${ratio})`, transformOrigin: 'left top'}}
        xDomain={[viewport.x, viewport.x + 3000]}
        yDomain={[viewport.y, viewport.y + 610]}
      >
        {renderLineSeries()}
        {renderMarkSeries()}
        {renderNodeLabelSeries()}
        {renderLinkLabelSeries()}
      </XYPlot>
      {showInfo && (
        <div className='info-box'>
          <div className='info-content'>
            <button onClick={() => setShowInfo(false)} className='info-top'>
              <VscExport />
              <b>Details</b>
            </button>
            <p className='metadata'>{selectedPod}</p>
            {selectedEdge && <p className='metadata'>{selectedEdge}</p>}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export { Operation };
*/