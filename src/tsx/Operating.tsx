//Operation.tsx using cytoscape.js 병합 - > 12/8 병합(resetx)

import React, { useState, useEffect, useRef } from 'react';
import cytoscape, { EdgeSingular, EventObject } from 'cytoscape';
import "../css/App.css";
import '../css/Summary.css';
import '../css/modal.css';
import fcose from 'cytoscape-fcose'; //수정
import { Modal, Text, IconButton, Icon, initializeIcons, ZIndexes, MessageBar, MessageBarType, CommandBar, ICommandBarItemProps  } from '@fluentui/react'; //수정
import { Logic, LogicPod } from './summary.tsx';
import { Data, JsonData, PodData, PodJsonData, SecurityData, SecurityJsonData } from './types.tsx';
import data from'../public/data.json';
import { relative } from 'path';
import { wait } from '@testing-library/user-event/dist/utils';
import { Button, Divider, Field, Input, Tooltip } from '@fluentui/react-components';
import { Search32Regular, ZoomIn24Regular, ZoomOut24Regular, ArrowClockwise28Regular, CircleSmallRegular, ArrowExport20Regular  } from '@fluentui/react-icons' //수정

initializeIcons();
cytoscape.use(fcose); //추가

// 데이터 정의
let a = data;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Operation = (Props) => {
  // UI 요소 관리를 위한 상태
  const [showInfo, setShowInfo] = [Props.showInfo, Props.setShowInfo];
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
  const [isInitialRender, setIsInitialRender] = useState(true); //추가
  const [prevNodes, setPrevNodes] = useState<Set<string>>(new Set()); //추가
  const deletedEdges: any[] = []; //추가, 삭제된 간선 정보 저장

  //추가, 알림창 
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [notifications, setNotifications] = useState<{ header: string; src_pod: string; dst_pod: string; danger_degree: string; message: string; timestamp: string;}[]>([]);
  const [activeModals, setActiveModals] = useState<Record<number, NodeJS.Timeout | null>>({}); 
  
  // data.json 데이터 로드
  const [tdata, setTdata] = useState<JsonData | null>(null); //json 받는 컨테이너
  const [linkData, setLinkData] = useState<Data[] | null>(null); // src, dst, data_len
  const [podData, setPodData] = useState(new Map()); // 포드들의 실제 데이터 모임
  const [pleaseData, setPleaseData] = useState<PodData[] | null>(null); // 포드들의 실제 데이터 모임2
  const [securityData, setSecurityData] = useState(new Map<string, SecurityData>());
  const [curPodData, setCurPodData] = useState<Map<string, PodData>>(new Map());
  
  //추가, 애니메이션
  const animationIds: any[] = [];
  const animationRef = Props.animationRef;


  const graphWidth = 1300;
  const graphHeight = 600;

   //graph layout 설정
  const layoutOptions = {
    name: 'fcose' as any,
    idealEdgeLength: (edge: cytoscape.EdgeSingular) => 50,
    nodeOverlap: 100,
    refresh: 20,
    fit: true,
    padding: 10,
    randomize: isInitialRender,
    componentSpacing: 300,
    animate: false,
    nodeRepulsion: (node: cytoscape.NodeSingular) => 1000000000,
    edgeElasticity: (edge: cytoscape.EdgeSingular) => 100,
    nestingFactor: 10,
    gravity: 100,     
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  }

  useEffect(() => {
    Logic(setTdata, setPodData, setSecurityData);

    
    let timer = setInterval(() => {
      Logic(setTdata, setPodData, setSecurityData);
    }, 6000);

    setTimeout(() => setIsInitialRender(false), 0); //추가

    return () => {
        clearInterval(timer);
    }

    //return;
  }, []);

  //수정
  useEffect(() => {
    for (let pod of securityData.values()) {
      if (['critical', 'warning', 'fail'].includes(pod.danger_degree)) {
        const header = `${pod.danger_degree} Pod Occurs`;
        const src_pod = pod.src_pod;
        const dst_pod = pod.dst_pod;
        const danger_degree = pod.danger_degree;
        const message = pod.message;
        const timestamp = pod.timestamp;
        addNotification(header, src_pod, dst_pod, danger_degree, message, timestamp);
        setIsModalOpen(true);     
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
      const newEdges: Set<string> = new Set();
      const newNodes: Set<string> = new Set();

      tdata.data.forEach((item: Data) => {
        const source = item.src_pod; 
        const target = item.dst_pod;
        const podSourceData = podData.get(source);
        const podTargetData = podData.get(target);
        //노드 및 간선 변화 확인하기 위함
        newEdges.add(`${source}${target}`); 
        newNodes.add(source);
        newNodes.add(target);
        
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
        elements.push({ data: { id: `${source}${target}_1`, source: source, target: target, label: String(item.data_len) } }); //수정, 간선의 동적임 표현 위함
        elements.push({ data: { id: `${source}${target}_2`, source: source, target: target, label: String(item.data_len) } }); //수정
      });

      Object.keys(namespaces).forEach((namespace) => {
        elements.push({ data: { id: namespace, isNamespace: true } });
      });
  
      if(!cyRef.current){
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
              'border-width': '7px', //수정
            },
          },
          {//수정
            selector: 'node[?isNamespace]', 
            style: {
              'label': '', 
              'border-opacity': 0,
              'background-opacity': 0, 
              'events': 'no'
            },
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'unbundled-bezier',
              'control-point-distances': '20 -20',
              'label': '',
              'opacity': 0.8
            },
          },
        ],//수정
        layout: layoutOptions
      });
      setPrevNodes(newNodes);
    }else {
      cyRef.current.edges().forEach(edge => { //간선 삭제 시 아예 삭제하는 것이 아니라 투명도를 높힘
        const edgeId = edge.data('id').split('_')[0];
        if (newEdges.has(edgeId)) {
          edge.style('opacity', 1);
        } else {
          edge.style('opacity', 0.2);
          deletedEdges.push(edge.data()); //엣지 데이터 저장
        }
      });

      cyRef.current.nodes().forEach(node => {
        if (!newNodes.has(node.id())) {
          cyRef.current.remove(`edge[source = "${node.id()}"], edge[target = "${node.id()}"]`);
        }
      });

      //노드 변경사항 감지
      if (nodeChange(newNodes, prevNodes)) {
        setPrevNodes(newNodes);
        cyRef.current.add(elements);
        cyRef.current.layout(layoutOptions).run(); //변화 있으면 layout 재실행
      }else{//엣지 변경사항 반영
        cyRef.current.add(elements.filter(element => element.data.source));
      }
    }

      //마우스로 노드 움직이지 못하게 고정
      cyRef.current.on('grab', 'node', function (event) {
        event.target.ungrabify();
      });
      
      
      //수정, 노드 클릭 핸들러
      cyRef.current.on('tap', 'node', function(evt: EventObject){
        const node = evt.target;
        if (node.data('isNamespace')) {
          return;
        }
      
        //노드 클릭 시 하이라이팅 구현
        cyRef.current.nodes().removeStyle('border-width opacity');
        cyRef.current.edges().removeStyle('line-color target-arrow-color opacity');
    
        animateDelete();
        cyRef.current.elements(`node[^isNamespace], edge`).style({ 'opacity': 0.3 });
        cyRef.current.elements(`edge[id $= '_2']`).style({ 'opacity': 0 });

        node.style({ 'border-width': '8px', 'opacity': 1 });
      
        //관련 노드 찾기
        const connectedEdges = node.connectedEdges(function(edge: EdgeSingular) {
          return edge.source().id() === node.id() || edge.target().id() === node.id();
        });
    
        connectedEdges.forEach(function(edge: EdgeSingular) {
          edge.connectedNodes().style({ 'border-width': '10px', 'opacity': 1 });
          animateEdge(edge, animationIds);
        });
      
        handlePodClick({ x: node.position().x, y: node.position().y, name: node.id() });
    });
          
    //수정, 엣지 클릭 시 하이라이팅 구현
    cyRef.current.on('tap', 'edge', function(evt: EventObject){
      const edge = evt.target;
      const connectedNodes = edge.connectedNodes();

      cyRef.current.nodes().removeStyle('border-width opacity');
      cyRef.current.edges().removeStyle('line-color target-arrow-color opacity');
      animateDelete();
      cyRef.current.elements('node[^isNamespace], edge').style({ 'opacity': 0.3 });
      cyRef.current.elements(`edge[id $= '_2']`).style({ 'opacity': 0 });
      connectedNodes.style({ 'border-width': '10px', 'opacity': 1 });

      if (edge.id().endsWith('_1') || edge.id().endsWith('_2')) {
        const edgeBaseId = edge.id().slice(0, -2);
        const edge1 = cyRef.current.getElementById(`${edgeBaseId}_1`);
        const edge2 = cyRef.current.getElementById(`${edgeBaseId}_2`);
    
        [edge1, edge2].forEach((edge) => {
          if (edge) {
            // edge.style({'line-color': 'black', 'target-arrow-color': 'black', 'opacity': 0.7 });
            animateEdge(edge, animationIds);
          }
        });
      }

      handleEdgeClick({ source: edge.source().id(), target: edge.target().id() });
    });
          
    tdata.data.forEach(updateNodeData);
    tdata.data.forEach(updateEdgeData); //추가
    
    updateNodeSizes();
    updateEdgeSizes(); //추가
  }
}, [tdata]);

const nodeChange = (newNodes: Set<string>, prevNodes: Set<string>) => {
  if (newNodes.size !== prevNodes.size) return true; // 노드의 개수가 다르면 true 반환
  for (let item of newNodes) {
    if (!prevNodes.has(item)) return true; // 새로운 노드가 있으면 true 반환
  }
  return false; // 노드의 변화가 없으면 false 반환
};

//수정, 초당 트래픽에 비례한 노드 크기
const updateNodeData = (item: any) => {
  const src = item.src_pod;
  const dst = item.dst_pod;
  const srcNode = cyRef.current.nodes().getElementById(src);
  const dstNode = cyRef.current.nodes().getElementById(dst);

  if (srcNode && dstNode) {
    const updateNode = (node, dataLen) => {
      const firstUpdateTime = node.data('firstUpdateTime') || item.timestamp;
      const lastUpdateTime = node.data('lastUpdateTime') || item.timestamp;
      const totalDataLen = (node.data('totalDataLen') || 0) + dataLen;

      const dataPerSecond = totalDataLen / ((lastUpdateTime - firstUpdateTime) + 1);
      node.data({
        totalDataLen: totalDataLen,
        dataPerSecond: dataPerSecond,
        firstUpdateTime: Math.min(firstUpdateTime, item.timestamp),
        lastUpdateTime: Math.max(lastUpdateTime, item.timestamp),
      });
    };

    updateNode(srcNode, item.data_len); // 보내는 데이터 양
    updateNode(dstNode, item.data_len);  // 받는 데이터 양
  }
};

//수정
const updateNodeSizes = () => {
  cyRef.current.nodes().forEach((node: cytoscape.NodeSingular) => { 
    const dataPerSecond = Math.abs(node.data('dataPerSecond') || 0);
    const nodeSize = Math.max(dataPerSecond * 0.002, 15); 
    if (!isInitialRender) {
      node.animate({
          style: {
            'width': `${nodeSize}px`,
            'height': `${nodeSize}px`
          },
          duration: 1000,
          easing: 'linear',
        });
      }else{
        node.style({
          'width': `${nodeSize}px`,
          'height': `${nodeSize}px`
        })
      }
  });
};

  //추가, datalen에 비례한 간선 두께 계산
  const calculateEdgeWidth = (edge: cytoscape.EdgeSingular) => {
    return Math.max(edge.data('data_len') * 0.005, 1.5);
  };

  //추가, 간선 두께 계산
  const updateEdgeData = (item: any) => {
    const edgeId1 = `${item.src_pod}${item.dst_pod}_1`; 
    const edgeId2 = `${item.src_pod}${item.dst_pod}_2`; 
  
    [edgeId1, edgeId2].forEach((edgeId) => {
      const edge = cyRef.current.edges().getElementById(edgeId);
  
      if (edge) {
        const newDataLen = item.data_len;
        edge.data('data_len', newDataLen);
  
      }
    });
  };

  //추가, datalen의 변화를 동적으로 보여줌
  const updateEdgeSizes = () => {
    cyRef.current.edges().forEach((edge: cytoscape.EdgeSingular) => {
      const edgeWidth = calculateEdgeWidth(edge);
  
      if (!isInitialRender) {
        edge.animate({
          style: {
            'width': `${edgeWidth}px`,
          },
          duration: 1000,
          easing: 'linear',
        });
      } else { //초기 랜더링 시 애니메이션 없이 보여줌
        edge.style({
          'width': `${edgeWidth}px`,
        });
      }
    });
  };

  //추가, 간선에 동적임 추가
  const animateEdge = (edge: EdgeSingular, animationIds: any[]) => {
    const originalLineStyle = edge.style('line-style').value;
    const animationDuration = 5000; 
    const animationSteps = 1000;
    const dashOffsetStep = -1; 
    let currentStep = 0;
    
    const animate = () => {
      const dashOffset = currentStep * dashOffsetStep;
      const edgeWidth = calculateEdgeWidth(edge); 

      if (edge.id().endsWith('_1')) { 
        edge.style({'line-color': 'black', 'target-arrow-color': 'black', 'opacity': 0.7 });
      }else if (edge.id().endsWith('_2')){
        edge.style({ 'line-color': 'white', 'target-arrow-shape': 'none', 'line-style': 'dashed', 'line-dash-pattern': [3, 100], 'line-dash-offset': dashOffset, 'width': edgeWidth*0.7, 'opacity': 1});
      }
      currentStep = (currentStep + 1) % animationSteps;
      
      if (currentStep < animationSteps) {
        animationRef.current[edge.id()] = requestAnimationFrame(animate);
      }

    };
    
    animationRef.current[edge.id()] = requestAnimationFrame(animate);
  };  

  //간선 동적임 삭제
  const animateDelete = () => {
    cyRef.current.edges().removeStyle('line-color target-arrow-color opacity line-style')
    for (let id in animationRef.current) {
      cancelAnimationFrame(animationRef.current[id]);
    }
    animationRef.current = {}; 
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

  //수정
  const findEdgeData = (source: string, target: string): Data | null => {
    if(tdata === null) {
      return null;
    }
  
    for(let i = 0; i < tdata.data.length; i++) {
      const item = tdata.data[i];
      if(item.src_pod === source && item.dst_pod === target) {
        return item;
      }
    }
  
    return null;
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

  //아이콘 수정
  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    const podInfo = podData.get(pod.name);
    setSelectedPod(
      <div>
        <h3>Pod Information</h3>
        <p>
          <CircleSmallRegular /> namespace: {pod.name.split(':')[0]} <br />
          <CircleSmallRegular /> name: {pod.name.split(':')[1]} <br />
          <CircleSmallRegular /> ip: {podInfo.ip} <br />
          <CircleSmallRegular /> danger_degree: {podInfo.danger_degree} <br />
        </p>
      </div>
    );
    setSelectedEdge(null);
    setShowInfo(true);
  };

  //수정
  const handleEdgeClick = (edge: { source: string; target: string }) => {
    const edgeInfo = findEdgeData(edge.source, edge.target);
    setSelectedEdge(
      <div>
        <h3>Communication Information</h3>
        <p>
          <CircleSmallRegular /> Communication {edge.source} to {edge.target} <br />
          <CircleSmallRegular /> SrcPod: {edgeInfo?.src_pod} <br />
          <CircleSmallRegular /> DstPod: {edgeInfo?.dst_pod} <br />
          <CircleSmallRegular /> Data length: {edgeInfo?.data_len} <br />
          <CircleSmallRegular /> Timestamp: {edgeInfo?.timestamp} <br />
        </p>
      </div>
    );
    setSelectedPod(null);
    setShowInfo(true);
  };

 //추가, 알림창
 const addNotification = (header: string, src_pod: string, dst_pod: string, danger_degree: string, message: string, timestamp: string) => {
  setNotifications((prevNotifications) => {
    const newNotification = { header, src_pod, dst_pod, danger_degree, message, timestamp };

    // 알림 추가 시 타이머 설정
    const timer = setTimeout(() => {
      removeNotification(prevNotifications.length); // 10초 후에 현재 알림 제거
    }, 10000);
    setActiveModals((prevModals) => {
      return { ...prevModals, [prevNotifications.length]: timer }; // 타이머 저장
    });

    return [...prevNotifications, newNotification];
  });
};

const removeNotification = (index: number) => {
  setNotifications((prevNotifications) => {
    return prevNotifications.filter((_, i) => i !== index);
  });

  // 알림 제거 시 해당 타이머 해제
  clearTimeout(activeModals[index]!);
  setActiveModals((prevModals) => {
    const newModals = { ...prevModals };
    delete newModals[index]; // 타이머 제거
    return newModals;
  });

  if (notifications.length === 1) {
    setIsModalOpen(false); // 알림이 모두 제거되었을 때 모달창 닫기
  }
};

const getMessageBarType = (danger_degree: string) => {
  switch (danger_degree) {
    case 'warning':
      return MessageBarType.warning;
    case 'critical':
      return MessageBarType.error;
    case 'fail':
      return MessageBarType.blocked;
    default:
      return MessageBarType.success;
  }
};

  
  return (
      <div className='content' onMouseMove={handleMouseMove} onWheel={handleWheelMove}>
        <div id="cy" style={{ width: '100%', height: '93%', marginTop: '40px' }} />
          {showInfo && (
            <div className='info-box'>
              <div className='info-content'>
                <button onClick={() => setShowInfo(false)} className='info-top'>
                  <ArrowExport20Regular  />
                  <b>Details</b>
                </button>
                <p className='metadata'>{selectedPod}</p>
                {selectedEdge && <p className='metadata'>{selectedEdge}</p>}
              </div>
            </div>
          )}
          <Modal isOpen={isModalOpen} isBlocking={false} isModeless={true} className="modal-slide-up" focusTrapZoneProps={{isClickableOutsideFocusTrap: true, forceFocusInsideTrap: false, autoFocus: false }}   styles={{ main: { boxShadow: 'none' } }}>  
            {notifications.map(({ header, src_pod, dst_pod, danger_degree, message, timestamp}, index) => (
              <MessageBar
              messageBarType={getMessageBarType(danger_degree)} // 수정된 부분
              isMultiline={false}
                onDismiss={() => removeNotification(index)}
                dismissButtonAriaLabel="Close"
                styles={{ root: { border: '1px solid #000', borderRadius: '5px', backgroundColor: danger_degree === 'fail' ? '#E2E2E2' : undefined, boxShadow: '0 3px 10px black' } }} 
              >
              <h3>{header}</h3>
              <p>{timestamp}</p>
              </MessageBar>
          ))}
      </Modal>
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

  //추가
  const animationIds: any[] = [];
  const animationRef = useRef<{[key: string]: number}>({});

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  //수정, 검색
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
      connectedEdges1.forEach(edge => animateEdge(edge, animationIds));
      cyRef.current.fit(searchedNodes1.union(connectedEdges1)); //화면에 맞게 출력
    }else { //namespace:pod 검색
      const searchedNode = inputValue;
      const searchedNodes2 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === searchedNode);
      const searchedNamespace2 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === inputValue.split(':')[0]);
  
      searchedNodes2.style({ 'visibility': 'visible'});
      searchedNamespace2.style({ 'visibility': 'visible'});
      //관련 노드 찾기
      const connectedEdges2 = searchedNodes2.connectedEdges();
      const connectedNodes = connectedEdges2.connectedNodes();
  
      connectedEdges2.forEach(function(edge: EdgeSingular) {
        edge.style({ 'visibility': 'visible', 'curve-style': 'unbundled-bezier', 'control-point-distances': 100, 'control-point-weights': 0.5});
        edge.connectedNodes().style({ 'visibility': 'visible'});
        animateEdge(edge, animationIds);
        edge.connectedNodes().forEach((item) => {
          const searchedNamespace3 = nodes.filter((node: cytoscape.NodeSingular) => node.id() === item.id().split(':')[0]);
          searchedNamespace3.style({ 'visibility': 'visible'});
        })
      });
  
      cyRef.current.fit(connectedNodes.union(connectedEdges2));
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

  const calculateEdgeWidth = (edge: cytoscape.EdgeSingular) => {
    return Math.max(edge.data('data_len') * 0.005, 1.5);
  };

  //추가
  const animateEdge = (edge: EdgeSingular, animationIds: any[]) => {
    const originalLineStyle = edge.style('line-style').value;
    const animationDuration = 5000; 
    const animationSteps = 1000;
    const dashOffsetStep = -1; 
    let currentStep = 0;
    
    const animate = () => {
      const dashOffset = currentStep * dashOffsetStep;
      const edgeWidth = calculateEdgeWidth(edge); 

      if (edge.id().endsWith('_1')) { 
        edge.style({'line-color': 'black', 'target-arrow-color': 'black', 'opacity': 0.7 });
      }else if (edge.id().endsWith('_2')){
        edge.style({ 'line-color': 'white', 'target-arrow-shape': 'none', 'line-style': 'dashed', 'line-dash-pattern': [3, 100], 'line-dash-offset': dashOffset, 'width': edgeWidth*0.7, 'opacity': 1});
      }
      currentStep = (currentStep + 1) % animationSteps;
      
      if (currentStep < animationSteps) {
        animationRef.current[edge.id()] = requestAnimationFrame(animate);
      }

    };
    
    
    animationRef.current[edge.id()] = requestAnimationFrame(animate);
  };  

  //추가
  const animateDelete = () => {
    cyRef.current.edges().removeStyle('line-color target-arrow-color opacity line-style')
    for (let id in animationRef.current) {
      cancelAnimationFrame(animationRef.current[id]);
    }
    animationRef.current = {}; 
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

  //수정, reset
  const handleReset = () => {
    cyRef.current.fit(); //화면 크기에 맞추어 전체 view 보여줌
    cyRef.current.nodes().removeStyle('border-width opacity visibility')
    cyRef.current.edges().removeStyle('line-color line-style target-arrow-color opacity visibility curve-style control-point-distances control-point-weights')

    animateDelete();
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
  
  return ( //수정
    <div>
      <MBar />
      <Operation showInfo={showInfo} setShowInfo={setShowInfo} selectedPod={selectedPod} setSelectedPod={setSelectedPod}
        selectedEdge={selectedEdge} setSelectedEdge={setSelectedEdge} cyRef={cyRef} animationRef={animationRef}
        inputRef={inputRef} inputValue={inputValue} setInputValue={setInputValue}/>
    </div>
  );
}

export { Operation, OperationM };
