//Operation.tsx using cytoscape.js

import React, { useState, useEffect, useRef } from 'react';
import cytoscape, {EventObject } from 'cytoscape';
import "../css/App.css";
import '../css/Summary.css';
import { VscExport, VscCircleSmall, VscSearch, VscZoomOut, VscZoomIn } from 'react-icons/vsc';
import { Logic } from './summary';
import { Data, JsonData } from './types';
import data from'../public/data.json';
import { relative } from 'path';

// 데이터 정의
let a = data;

const Operation: React.FC = () => {
  // UI 요소 관리를 위한 상태
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<JSX.Element | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<JSX.Element | null>(null);
  const cyRef = useRef<any>(null);

  // 노드 위치, 색상 및 데이터 관리를 위한 상태
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [nodes, setNodes] = useState<{ x: number; y: number; name: string; size: number }[]>([]);
  const [links, setLinks] = useState<{ source: string; target: string }[]>([]);
  const [groupedNodes, setGroupedNodes] = useState<{ [key: string]: number }>({});

  // data.json 데이터 로드
  const [tdata, setTdata] = useState<JsonData | null>(null); //json 받는 컨테이너
  const [podData, setPodData] = useState<Data[] | null>(null);

  const graphWidth = 1300;
  const graphHeight = 600;
  const [ratio, setRatio] = useState(0.5);
  const [viewport, setViewport] = useState({x: 0, y: 0});

  useEffect(() => {
    Logic(res => setTdata(res));
    //console.log(tdata);
    let timer = setInterval(() => {
      Logic(res => setTdata(res));
      //console.log(tdata);
    }, 5000);

    // 타이머 클리어 (for setInterval)
    return () => {clearTimeout(timer)};
  }, []);

  useEffect(() => {

    console.log(tdata);
    if(tdata){
      setPodData(tdata.data); // 받아온 데이터 리스트 집어넣기.
    }
    else{
      return;
    }

    if (!cyRef.current) {
      const elements: cytoscape.ElementDefinition[] = [];
      const namespaces: { [key: string]: string[] } = {};
  
      data.forEach((item: any) => {
        const source = item.src;
        const target = item.dst;
  
        //네임스페이스를 기준으로 묶기기
        const [sourceNamespace, sourceName] = source.split(':');
        const [targetNamespace, targetName] = target.split(':');
  
        namespaces[sourceNamespace] = namespaces[sourceNamespace] || [];
        if (!namespaces[sourceNamespace].includes(sourceName)) {
          namespaces[sourceNamespace].push(sourceName);
        }
  
        namespaces[targetNamespace] = namespaces[targetNamespace] || [];
        if (!namespaces[targetNamespace].includes(targetName)) {
          namespaces[targetNamespace].push(targetName);
        }
  
        elements.push({ data: { id: source, label: source, parent: sourceNamespace } });
        elements.push({ data: { id: target, label: target, parent: targetNamespace } });
        elements.push({ data: { id: `${source}${target}`, source: source, target: target, label: String(item.data_len) } });
      });
  
      // Add namespace nodes
      Object.keys(namespaces).forEach((namespace) => {
        elements.push({ data: { id: namespace, label: namespace, isNamespace: true } });
      });

      //노드, 간선 랜더링
      cyRef.current = cytoscape({
        container: document.getElementById('cy'),
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'white',
              'label': 'data(label)',
              'border-color': 'green', 
              'border-width': '3px',
            },
          },
          {
            selector: 'node[?isNamespace]', //namespace
            style: {
              'label': '', 
              'border-color': 'white', 
            },
          },
          {
            selector: 'edge',
            style: {
              'width': 8,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              // 'curve-style': 'bezier',
              'curve-style': 'unbundled-bezier', // 2차 베지어 커브 적용
              'control-point-distances': 100, 
              'control-point-weights': 0.5, 
              'label': 'data(label)',
              // 'opacity': 0.3
            },
          },
        ],
            layout: {
              name: 'cose', //cytoscape-cose layout 사용
              idealEdgeLength: (edge) => 1,
              nodeOverlap: -20,
              refresh: 20,
              fit: true,
              padding: 30,
              randomize: true,
              componentSpacing: 100,
              nodeRepulsion: (node) => 100000000,
              edgeElasticity: (edge) => 5,
              nestingFactor: 10,    
              gravity: 10,     
              numIter: 1000,
              initialTemp: 200,
              coolingFactor: 0.95,
              minTemp: 1.0
            },
          });
        
          //핸들러
      cyRef.current.on('tap', 'node', function(evt: EventObject){
        const node = evt.target;
        if (node.data('isNamespace')) {
          return;
        }
        handlePodClick({ x: node.position().x, y: node.position().y, name: node.id() });
      });
     cyRef.current.on('tap', 'edge', function(evt: EventObject){
        const edge = evt.target;
        handleEdgeClick({ source: edge.source().id(), target: edge.target().id() });
      });

        cyRef.current.nodes().forEach((node: cytoscape.NodeSingular) => { //트래픽에 비례하여 노드 크기 조정 
          const degree = node.indegree(false); 
          const nodeSize = Math.max(degree * 10, 10); // 노드 크기는 간선 수에 비례하지만, 최소 크기는 10px
          node.style({
            'width': `${nodeSize}px`,
            'height': `${nodeSize}px`
          });
        });
      }
    }, [tdata]);

      //menu-bar
      const MBar = () => {
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
                <VscZoomOut />
              </button>
            </div>
          </div>
        );
      };

  const findNodeData = (PodKey: string) => {
    const NodeData = nodes.find(
      (node) =>
        node.name === PodKey
    );
    return NodeData || { x: 0, y: 0, name: '', size: 0 };
  };

  const findEdgeData = (sourcePod: string, destPod: string) => {
    const edgeData = podData?.find(
      (pod) =>
        `${pod.src}` === sourcePod &&
        `${pod.dst}` === destPod
    );
    return edgeData || { dst: '', data_len: '' };
  };

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
      const dr = e.deltaY; 
      setRatio((prevRatio) => (
        prevRatio + 0.001 * dr <= 0.2 ? (prevRatio >= 3.6 ? prevRatio + 0.001 * dr : 3.6) : 0.2
      ));
  };

  const handleZoomIn = () => {
    const dr = 0.2; 
    setRatio((prevRatio) => {
      const newRatio = prevRatio + dr <= 3.6 ? prevRatio + dr : 3.6;
      cyRef.current.zoom(newRatio); 
      return newRatio;
    });
  };
  
  const handleZoomOut = () => {
    const dr = -0.2; 
    setRatio((prevRatio) => {
      const newRatio = prevRatio + dr >= 0.2 ? prevRatio + dr : 0.2;
      cyRef.current.zoom(newRatio); 
      return newRatio;
    });
  };

  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    setSelectedPod(
      <div>
        <h3>Pod Information</h3>
        <p>
          <VscCircleSmall /> namespace: {pod.name.split(':')[0]} <br />
          <VscCircleSmall /> name: {pod.name.split(':')[1]} <br />
        </p>
      </div>
    );
    setSelectedEdge(null);
    setShowInfo(true);
  };

  const handleEdgeClick = (edge: { source: string; target: string }) => {
    const edgeData = findEdgeData(edge.source, edge.target);
    setSelectedEdge(
      <div>
        <h3>Communication Information</h3>
        <p>
          <VscCircleSmall /> Communication {edge.source} to {edge.target} <br />
          <VscCircleSmall /> DstPod Name: {edgeData.dst} <br />
          <VscCircleSmall /> Data length: {edgeData.data_len} <br />
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
        <div id="cy" style={{ width: '100%', height: '93%', marginTop: '40px' }} />
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
}

export default Operation;
