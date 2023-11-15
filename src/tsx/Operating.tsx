//Operation.tsx using cytoscape.js

import React, { useState, useEffect, useRef } from 'react';
import cytoscape, { EdgeSingular, EventObject } from 'cytoscape';
import "../css/App.css";
import '../css/Summary.css';
import { VscExport, VscCircleSmall, VscSearch, VscZoomOut, VscZoomIn, VscRefresh } from 'react-icons/vsc';
import { Logic } from './summary';
import { Data, JsonData, PodData } from './types';
import data from'../public/data.json';
import { relative } from 'path';

// 데이터 정의
let a = data;

const Operation: React.FC = () => {
  // UI 요소 관리를 위한 상태
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<JSX.Element | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<JSX.Element | null>(null);

  // Graph
  const cyRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [zoom, setZoom] = useState();
  const [viewport, setViewport] = useState({x: 0, y: 0});

  // 노드 위치, 색상 및 데이터 관리를 위한 상태
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [nodes, setNodes] = useState<{ x: number; y: number; name: string; size: number }[]>([]);
  const [links, setLinks] = useState<{ source: string; target: string }[]>([]);
  const [groupedNodes, setGroupedNodes] = useState<{ [key: string]: number }>({});

  // data.json 데이터 로드
  const [tdata, setTdata] = useState<JsonData | null>(null); //json 받는 컨테이너
  const [linkData, setLinkData] = useState<Data[] | null>(null); // src, dst, data_len
  let nodeData: PodData[] = []; // 포드들의 실제 데이터 모임

  const graphWidth = 1300;
  const graphHeight = 600;

  useEffect(() => {
    Logic(res => setTdata(res));
    //console.log(tdata);
    let timer = setInterval(() => {
      Logic(res => setTdata(res));
      //console.log(tdata);
    }, 10000);

    // 타이머 클리어 (for setInterval)
    return () => {clearTimeout(timer)};
  }, []);

  useEffect(() => {
    /*
    console.log(tdata);
    if(tdata){
      setLinkData(tdata.data); // 받아온 데이터 리스트 집어넣기.
    }
    else{
      return;
    }
    console.log(linkData);
*/
    setTimeout(() => {
        cyRef.current.fit();
      }, 100);

    if(tdata !== null){
      const elements: cytoscape.ElementDefinition[] = [];
      const namespaces: { [key: string]: string[] } = {};

      tdata.data.forEach((item: Data) => {
        const source = item.src_pod;
        const target = item.dst_pod;

        // Extract namespaces and group nodes
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

        elements.push({ data: { id: source, parent: sourceNamespace } });
        elements.push({ data: { id: target, parent: targetNamespace } });
        elements.push({ data: { id: `${source}${target}`, source: source, target: target, label: String(item.data_len) } });
      });

      // Add namespace nodes
      Object.keys(namespaces).forEach((namespace) => {
        elements.push({ data: { id: namespace, isNamespace: true } });
      });
  
      cyRef.current = cytoscape({
        container: document.getElementById('cy'),

        wheelSensitivity: 0.5,
        minZoom: 0.2,
        maxZoom: 2.0,

        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'white',
              'label': 'data(id)',
              'border-color': 'green', 
              'border-width': '7px',
            },
          },
          {
            selector: 'node[?isNamespace]',
            style: {
              'border-color': 'white', // make border the same color as background
              'events': 'no'
            },
          },
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              // 'curve-style': 'unbundled-bezier', // 2차 베지어 커브 적용
              // 'control-point-distances': 100, // 2차 베지어 커브의 제어점 거리 설정
              // 'control-point-weights': 0.5, // 2차 베지어 커브의 제어점 가중치 설정
              'label': 'data(label)',
              // 'opacity': 0.3
            },
          },
        ],
        layout: {
          name: 'cose',
          idealEdgeLength: (edge) => 1,
          nodeOverlap: 20,
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
/*
      setTimeout(() => {
        cyRef.current.fit();
      }, 100);
        */
          //핸들러
          cyRef.current.on('tap', 'node', function(evt: EventObject){
            const node = evt.target;
            if (node.data('isNamespace')) {
              return;
            }
          
            //노드 클릭 시 하이라이팅 구현
            cyRef.current.elements().removeStyle('line-color target-arrow-color border-width');
            cyRef.current.elements('node[^isNamespace], edge').style({ 'opacity': 0.3 });
    
            node.style({ 'border-width': '8px', 'opacity': 1 });
          
            //관련 노드 찾기
            const connectedEdges = node.connectedEdges(function(edge: EdgeSingular) {
              return edge.source().id() === node.id() || edge.target().id() === node.id();
            });
        
            connectedEdges.forEach(function(edge: EdgeSingular) {
              edge.style({ 'line-color': 'black', 'target-arrow-color': 'black', 'opacity': 1 });
              edge.connectedNodes().style({ 'border-width': '10px', 'opacity': 1 });
            });
          
            handlePodClick({ x: node.position().x, y: node.position().y, name: node.id() });
        });
          
          //엣지 클릭 시 하이라이팅 구현
          cyRef.current.on('tap', 'edge', function(evt: EventObject){
            const edge = evt.target;
            const connectedNodes = edge.connectedNodes();
    
            cyRef.current.elements().removeStyle('line-color target-arrow-color border-width');
            cyRef.current.elements('node[^isNamespace], edge').style({ 'opacity': 0.3 });
    
            edge.style({ 'line-color': 'black', 'target-arrow-color': 'black', 'opacity': 1 });
            connectedNodes.style({ 'border-width': '10px', 'opacity': 1 });
    
            handleEdgeClick({ source: edge.source().id(), target: edge.target().id() });
          });
          
          /*
          //zoom in, out
          cyRef.current.on('zoom', () => {
            setZoom(cyRef.current.zoom());
          });
          */

          data.data.forEach(updateNodeData);
          updateNodeSizes();
        }
    
      }, [tdata]);

      const updateNodeData = (item: any) => {
        const target = item.dst;
        const targetNode = cyRef.current.nodes().getElementById(target);
        if (targetNode) {
          // 노드의 데이터를 업데이트
          const firstUpdateTime = targetNode.data('firstUpdateTime') || item.time;
          const lastUpdateTime = targetNode.data('lastUpdateTime') || item.time;
          const totalDataLen = (targetNode.data('totalDataLen') || 0) + item.data_len;
      
          // 초당 데이터 속도를 계산. (마지막 업데이트 시간 - 처음 업데이트 시간)으로 나눔
          const dataPerSecond = totalDataLen / ((lastUpdateTime - firstUpdateTime) || 1);
      
          targetNode.data({
            totalDataLen,
            dataPerSecond,
            firstUpdateTime: Math.min(firstUpdateTime, item.time),
            lastUpdateTime: Math.max(lastUpdateTime, item.time),
          });
        }
      };
      
      // 새로운 함수: 노드의 크기를 업데이트하는 함수
      const updateNodeSizes = () => {
        cyRef.current.nodes().forEach((node: cytoscape.NodeSingular) => { 
          const totalDataLen = node.data('totalDataLen') || 0;
          const nodeSize = Math.max(totalDataLen*0.05, 10); 
          node.style({
            'width': `${nodeSize}px`,
            'height': `${nodeSize}px`
          }); 
        });
      };

      //menu-bar
      const MBar = () => {
        return (
          <div className="summary-menu">
            <div className="search">
              <input ref={inputRef} type="text" placeholder="Search..." value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} />
              <button onClick={handleSearch}>
                <VscSearch style={{ fontSize: '12px', strokeWidth: 2, paddingTop: '3px', marginRight: '5px' }} />
              </button>
              <div style={{border: '1px solid black', display: 'inline-block', marginLeft: '10px'}}>
                <button style={{ paddingTop: '3px', border:'none', borderRight:'1px solid black' }} onClick={handleZoomIn}>
                  Zoom
                  <VscZoomIn style={{ marginLeft: '5px' }} />
                </button>
                <button style={{ marginLeft: '5px', paddingTop: '3px', border:'none' }} onClick={handleZoomOut}>
                  <VscZoomOut style={{ marginRight: '5px' }} />
                </button>
              </div>
              <button style={{ marginLeft: '10px', paddingTop: '3px' }} onClick={handleReset}>
                Reset
                <VscRefresh style={{ marginLeft: '5px' }} />
              </button>
            </div>
          </div>
        );
      };

  //검색
  const handleSearch = () => {
    const nodes = cyRef.current.nodes();
    const edges = cyRef.current.edges();

    handleReset();
    nodes.style({ 'visibility': 'hidden' });
    edges.style({ 'visibility': 'hidden' });

    //namespace 검색
    if(inputValue.split(':')[0]==="namespace"){
      const searchedNamespace = inputValue.split(':')[1];
      const searchedNodes1 = nodes.filter((node: cytoscape.NodeSingular) => node.id().split(':')[0] === searchedNamespace);
      const connectedEdges1 = searchedNodes1.connectedEdges().filter((edge: cytoscape.EdgeSingular) => { //namespace 안에서의 통신만 보여줌
          const sourceNodeNamespace = edge.source().id().split(':')[0];
          const targetNodeNamespace = edge.target().id().split(':')[0];
          return sourceNodeNamespace === searchedNamespace && targetNodeNamespace === searchedNamespace;
      });

      searchedNodes1.style({ 'visibility': 'visible'});
      connectedEdges1.style({ 'visibility': 'visible', 'curve-style': 'unbundled-bezier', 'control-point-distances': 100, 'control-point-weights': 0.5 });
      
      cyRef.current.fit(searchedNodes1.union(connectedEdges1)); //화면에 맞게 출력
    }else { //namespace:pod 검색
      const searchedNode = inputValue;
      const searchedNodes2 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === searchedNode);  
      searchedNodes2.style({ 'visibility': 'visible' });
          
      //관련 노드 찾기
      const connectedEdges2 = searchedNodes2.connectedEdges(function(edge: EdgeSingular) {
        return edge.source().id() === searchedNodes2.id() || edge.target().id() === searchedNodes2.id();
      });
  
      connectedEdges2.forEach(function(edge: EdgeSingular) {
        edge.style({ 'visibility': 'visible', 'curve-style': 'unbundled-bezier', 'control-point-distances': 100, 'control-point-weights': 0.5});
        edge.connectedNodes().style({ 'visibility': 'visible'});  
      });
      cyRef.current.fit(searchedNodes2.union(connectedEdges2));
    }     
}

// 검색창에 입력하는 값을 state에 저장
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue(e.target.value);
};

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
}, [inputValue]);

  const findNodeData = (PodKey: string) => {
    const NodeData = nodes.find(
      (node) =>
        node.name === PodKey
    );
    return NodeData || { x: 0, y: 0, name: '', size: 0 };
  };

  const findEdgeData = (sourcePod: string, destPod: string) => {
    const edgeData = linkData?.find(
      (pod) =>
        `${pod.src_pod}` === sourcePod &&
        `${pod.dst_pod}` === destPod
    );
    return edgeData || { dst_pod: '', data_len: '' };
  };


const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
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
    const dr = e.deltaY * 0.001; 
    const newZoom = cyRef.current.zoom() + dr;
    if (newZoom >= 0.5 && newZoom <= 2.0) {
      cyRef.current.zoom({ level: newZoom, renderedPosition: { x: 650, y: 300 } });
    }
    console.log(newZoom);
  };

  const handleZoomIn = () => {
    cyRef.current.zoom({ level: (cyRef.current.zoom() + 0.2), renderedPosition: { x: 650, y: 300 } });
    console.log(cyRef.current.zoom());
  };
  
  const handleZoomOut = () => {
    cyRef.current.zoom({ level: (cyRef.current.zoom() - 0.2), renderedPosition: { x: 650, y: 300 } });
    console.log(cyRef.current.zoom());
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
          <VscCircleSmall /> DstPod Name: {edgeData.dst_pod} <br />
          <VscCircleSmall /> Data length: {edgeData.data_len} <br />
        </p>
      </div>
    );
    setSelectedPod(null);
    setShowInfo(true);
  };

  //reset
  const handleReset = () => {
    cyRef.current.fit(); //화면 크기에 맞추어 전체 view 보여줌
    cyRef.current.elements().removeStyle('line-color target-arrow-color border-width opacity visibility'); //클릭을 통해 바꾼 style 리셋
  
    setSelectedPod(null);
    setSelectedEdge(null);
    setShowInfo(false);
    setInputValue('');
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

export { Operation };
