//Operation.tsx
//Ops 부문 가시화
//수정 중 

//Operation.tsx using cytoscape.js

import React, { useState, useEffect, useRef } from 'react';
import cytoscape, { EdgeSingular, EventObject } from 'cytoscape';
import "../css/App.css";
import '../css/Summary.css';
import '../css/modal.css';
import { VscExport, VscCircleSmall, VscSearch, VscZoomOut, VscZoomIn, VscRefresh } from 'react-icons/vsc';
import { Modal, Text, IconButton, Icon, initializeIcons, CommandBar, ICommandBarItemProps  } from '@fluentui/react';
import { Logic, LogicPod } from './summary.tsx';
import { Data, JsonData, PodData, PodJsonData, SecurityData, SecurityJsonData } from './types.tsx';
import data from'../public/data.json';
import { relative } from 'path';
import { wait } from '@testing-library/user-event/dist/utils';
import { Button, Divider, Field, Input, Tooltip } from '@fluentui/react-components';
import { Search32Regular, ZoomIn24Regular, ZoomOut24Regular, ArrowClockwise28Regular } from '@fluentui/react-icons'

initializeIcons();

// 데이터 정의
let a = data;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Operation = (Props) => {
  // UI 요소 관리를 위한 상태
  const [ showInfo, setShowInfo ] = [Props.showInfo, Props.setShowInfo];
  const [selectedPod, setSelectedPod] = [Props.selectedPod, Props.setSelectedPod];
  const [selectedEdge, setSelectedEdge] = [Props.selectedEdge, Props.setSelectedEdge] ;

  // Graph
  const cyRef = Props.cyRef;
  const inputRef = Props.inputRef;
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = [Props.inputValue, Props.setInputValue];
  const [zoom, setZoom] = useState();
  const [viewport, setViewport] = useState({x: 0, y: 0});

  // 노드 위치, 색상 및 데이터 관리를 위한 상태
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [nodes, setNodes] = useState<{ x: number; y: number; name: string; size: number }[]>([]);
  const [links, setLinks] = useState<{ source: string; target: string }[]>([]);
  const [groupedNodes, setGroupedNodes] = useState<{ [key: string]: number }>({});

  //추가, 알림창 
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [notifications, setNotifications] = useState<{ header: string; src_pod: string; dst_pod: string; message: string; status: string; }[]>([]);
  const [activeModals, setActiveModals] = useState<Record<number, boolean>>({});

  // data.json 데이터 로드
  const [tdata, setTdata] = useState<JsonData | null>(null); //json 받는 컨테이너
  const [linkData, setLinkData] = useState<Data[] | null>(null); // src, dst, data_len
  const [podData, setPodData] = useState(new Map()); // 포드들의 실제 데이터 모임
  const [pleaseData, setPleaseData] = useState<PodData[] | null>(null); // 포드들의 실제 데이터 모임2
  
  const [securityData, setSecurityData] = useState(new Map<string, SecurityData>());
  const [curPodData, setCurPodData] = useState<Map<string, PodData>>(new Map());
  

  const graphWidth = 1300;
  const graphHeight = 600;

  useEffect(() => {
    Logic(setTdata, setPodData, setSecurityData);

    
    let timer = setInterval(() => {
      Logic(setTdata, setPodData, setSecurityData);
    }, 6000);

    return () => {
        clearInterval(timer);
    }

    //return;
  }, []);

  useEffect(() => {
    //console.log(securityData);
    for (let pod of securityData.values()) {
      if (['critical', 'warning', 'fail'].includes(pod.danger_degree)) {
        const header = `${pod.src_pod} to ${pod.dst_pod} is in ${pod.danger_degree} status!`;
        const src_pod = pod.src_pod;
        const dst_pod = pod.dst_pod;
        const message = pod.message;
        //addNotification(header, src_pod, dst_pod, message, pod.danger_degree);
        //setIsModalOpen(true);
        //console.log(pod);
      }
    }
  }, [securityData]);

  useEffect(() => {
    //console.log(tdata);
    console.log(podData);
    //console.log(pleaseData);

    setTimeout(() => {
      if(cyRef.current){
        cyRef.current.fit();
      }
    }, 100);


    if(tdata != null){
      const elements: cytoscape.ElementDefinition[] = [];
      const namespaces: { [key: string]: string[] } = {};

      tdata.data.forEach((item: Data) => {
        const source = item.src_pod; //default:A1
        const target = item.dst_pod;
        const podSourceData = podData.get(source);
        const podTargetData = podData.get(target);

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

        if(podData.size==0) return;
        //console.log(podData);

        //console.log(podData.get(source));
        //console.log(target);
        //console.log(podData.get(target));
        if(podSourceData) {
          elements.push({ data: { id: source, parent: sourceNamespace, danger_degree: podSourceData.danger_degree} });
        } else {
          elements.push({ data: { id: source, parent: sourceNamespace, danger_degree: 'noInfo'} }); // no pod Information
        }
        
        if(podTargetData) {
          elements.push({ data: { id: target, parent: targetNamespace, danger_degree: podTargetData.danger_degree} });
        } else {
          elements.push({ data: { id: target, parent: targetNamespace, danger_degree: 'noInfo'} }); // no pod Information
        }
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
              'border-color': function(ele){
                return getNodeColor(ele.data('danger_degree')); 
              },
              'border-width': '3px',
            },
          },
          {
            selector: 'node[?isNamespace]', // 이게 뭐죠?
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
          
          

          tdata.data.forEach(updateNodeData);
          //console.log(cyRef.current.nodes());
          updateNodeSizes();
        }
  }, [tdata]);

  const updateNodeData = (item: any) => {
    const target = item.dst_pod;
    const targetNode = cyRef.current.nodes().getElementById(target);
    //console.log(cyRef.current.nodes());
    //console.log(targetNode);
    //console.log(target);
    console.log(targetNode.size());
    if (targetNode) {
      // 노드의 데이터를 업데이트
      const firstUpdateTime = targetNode.data('firstUpdateTime') || item.timestamp;
      const lastUpdateTime = targetNode.data('lastUpdateTime') || item.timestamp;
      const totalDataLen = (targetNode.data('totalDataLen') || 0) + item.data_len;

      // 초당 데이터 속도를 계산. (마지막 업데이트 시간 - 처음 업데이트 시간)으로 나눔
      const dataPerSecond = totalDataLen / ((lastUpdateTime - firstUpdateTime) || 1);
      //console.log(totalDataLen);
      targetNode.data({
        totalDataLen: totalDataLen,
        dataPerSecond: dataPerSecond,
        firstUpdateTime: Math.min(firstUpdateTime, item.timestamp),
        lastUpdateTime: Math.max(lastUpdateTime, item.timestamp),
      });
    }
    //console.log(targetNode);
  };
      
  // 노드의 크기를 업데이트하는 함수
  const updateNodeSizes = () => {
    cyRef.current.nodes().forEach((node: cytoscape.NodeSingular) => { 
      const totalDataLen = node.data('totalDataLen') || 0;
      //console.log(totalDataLen);
      const nodeSize = Math.max(totalDataLen * 0.002, 20); 
      node.style({
        'width': `${nodeSize}px`,
        'height': `${nodeSize}px`
      }); 
    });
  };

  //추가, 노드 색 결정
  const getNodeColor = (danger_degree: string) => {
    switch (danger_degree) {
      case 'warning':
        return 'rgb(255, 200, 0)';
      case 'critical':
        return 'red';
      case 'fail':
        return 'black';
      default:
        return 'green';
    }
  };

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

  
  
  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    const podInfo = podData.get(pod.name);
    setSelectedPod(
      <div>
        <h3>Pod Information</h3>
        <p>
          <VscCircleSmall /> namespace: {pod.name.split(':')[0]} <br />
          <VscCircleSmall /> name: {pod.name.split(':')[1]} <br />
          <VscCircleSmall /> ip: {podInfo.ip} <br />
          <VscCircleSmall /> danger_degree: {podInfo.danger_degree} <br />
          <VscCircleSmall /> description: {podInfo.message} <br />
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

  

  //추가, 알림창
  const addNotification = (header: string, src_pod: string, dst_pod: string, status: string, message: string) => {
    setNotifications((prevNotifications) => {
      const newNotification = { header, src_pod, dst_pod, status, message };
      const newIndex = prevNotifications.length;
      setActiveModals((prevModals) => ({ ...prevModals, [newIndex]: true }));
      return [...prevNotifications, newNotification];
    });
  };

  const removeNotification = (index: number) => {
    setActiveModals((prevModals) => ({ ...prevModals, [index]: false }));
  };

  const ModalHeader = ({ status }: { status: string }) => (
      <div style={{ backgroundColor: getNodeColor(status), height: '10px' }} />
  );
    
  const closeModal = () => {
      setIsModalOpen(false);
  };
  
  return (
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
          {notifications.map(({ header, src_pod, dst_pod, message, status }, index) => (
            <Modal key={index} isOpen={activeModals[index]} onDismiss={() => removeNotification(index)} isBlocking={false} isModeless={true} className="modal-slide-up">  
                <ModalHeader status={status} />                
                <div>
                <IconButton
                  iconProps={{ iconName: 'ChromeClose' }}
                  title="Close"
                  ariaLabel="Close"
                  onClick={() => removeNotification(index)}
                  style={{ position: 'absolute', right: '5px', top: '10px' }}
                  styles={{ icon: { fontSize: 13,  color: 'black'} }}
                />
                  <h3 style={{textAlign: 'center'}}>{header}</h3>
                  <p><Icon iconName="CircleShapeSolid" style={{ marginLeft: '15px' }} styles={{ root: {fontSize: 7}}}/> src: {src_pod}</p>
                  <p><Icon iconName="CircleShapeSolid" style={{ marginLeft: '15px' }} styles={{ root: {fontSize: 7}}}/> dst: {dst_pod}</p>
                  <p><Icon iconName="CircleShapeSolid" style={{ marginLeft: '15px' }} styles={{ root: {fontSize: 7}}}/> problem: {message}</p>
                </div>
            </Modal>
          ))}
    </div>
);
}

const OperationM: React.FC = () => {
  // UI 요소 관리를 위한 상태
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<JSX.Element | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<JSX.Element | null>(null);
  
  // Graph
  const cyRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [isSearch, setIsSearch] = useState(false);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

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
      //console.log(searchedNodes1.style());
      cyRef.current.fit(searchedNodes1.union(connectedEdges1)); //화면에 맞게 출력
    }else { //namespace:pod 검색
      const searchedNode = inputValue;
      const searchedNodes2 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === searchedNode);
      const searchedNamespace2 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === inputValue.split(':')[0]);

      searchedNodes2.style({ 'visibility': 'visible'});
      searchedNamespace2.style({ 'visibility': 'visible'});
      
      //관련 노드 찾기
      const connectedEdges2 = searchedNodes2.connectedEdges();

      connectedEdges2.forEach(function(edge: EdgeSingular) {
        edge.style({ 'visibility': 'visible', 'curve-style': 'unbundled-bezier', 'control-point-distances': 100, 'control-point-weights': 0.5});
        edge.connectedNodes().style({ 'visibility': 'visible'});
        edge.connectedNodes().forEach((item) => {
          const searchedNamespace3 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === item.id().split(':')[0]);
          searchedNamespace3.style({ 'visibility': 'visible'});
        })
      });

      cyRef.current.fit(searchedNodes2.union(connectedEdges2));
    }
    //nodes.style({ 'visibility': 'visible' });
    setIsSearch(true);
  }

  // 검색창에 입력하는 값을 state에 저장
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('abc')
    setInputValue(e.target.value);
    //wait(10000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleZoomIn = () => {
    cyRef.current.zoom({ level: (cyRef.current.zoom() + 0.2), renderedPosition: { x: 650, y: 300 } });
    console.log(cyRef.current.zoom());
  };
  
  const handleZoomOut = () => {
    cyRef.current.zoom({ level: (cyRef.current.zoom() - 0.2), renderedPosition: { x: 650, y: 300 } });
    console.log(cyRef.current.zoom());
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

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'div1-1',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'search',
      text: 'Search',
      iconProps: { iconName: 'Search' },
      onClick: () => handleSearch(),
    },
    {
      key: 'div1-2',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'zoom_in',
      text: 'Zoom In',
      iconProps: { iconName: 'ZoomIn' },
      onClick: () => handleZoomIn(),
    },
    {
      key: 'zoom_out',
      text: 'Zoom Out',
      iconProps: { iconName: 'ZoomOut' },
      onClick: () => handleZoomOut(),
    },
    {
      key: 'div1-3',
      onRender: () => <Divider vertical/>
    },
    {
      key: 'reset',
      text: 'Reset',
      iconProps: { iconName: 'Refresh' },
      onClick: () => handleReset(),
    },
    {
      key: 'div1-4',
      onRender: () => <Divider vertical/>
    },
  ];

  /*
<Tooltip content="Search" relationship='label'>
          <Button onClick={handleSearch} icon={<Search32Regular/>} />
        </Tooltip>
  */
  
  //menu-bar
  const MBar = () => {
    return (
      <div className="summary-menu">
        <div style={{marginLeft: '15px'}}>
          <Input ref={inputRef} type="text" placeholder="Search..." value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} />
        </div>
        <CommandBar items={commandBarItems}></CommandBar>
      </div>
    );
  };
  
  return (
    <div>
      <MBar />
      <Operation showInfo={showInfo} setShowInfo={setShowInfo} selectedPod={selectedPod} setSelectedPod={setSelectedPod}
        selectedEdge={selectedEdge} setSelectedEdge={setSelectedEdge} cyRef={cyRef} 
        inputRef={inputRef} inputValue={inputValue} setInputValue={setInputValue}/>
    </div>
  );
}


export { Operation, OperationM };
