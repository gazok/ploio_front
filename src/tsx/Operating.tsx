//Operation.tsx
//Ops 부문 가시화
//수정 중

import React, { useState, useEffect } from 'react';
import { XYPlot, MarkSeries, LineSeries } from 'react-vis';
import data from './data.json';
import './App.css';
import './Summary.css';
import { VscExport } from 'react-icons/vsc';

//데이터 형식 정의
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

  const nodeGroups: { [key: string]: number } = {}; //같은 src를 가진 것끼리 묶음
  const nodes: { x: number; y: number; name: string; size: number }[] = [];
  const links: { source: string; target: string }[] = [];
  const nodePositions: { [key: string]: { x: number; y: number } } = {};


    for (const pod of podData) {
      const nodeKey = `${pod.src_ip}:${pod.src_port}`;
      if (!nodePositions[nodeKey]) {
        nodePositions[nodeKey] = {
          x: Math.random() * 400,
          y: Math.random() * 200,
        };
      }

      //개수 확인하려고 넣은 겁니다. 잘 되나 확인하려고
      if (nodeGroups[nodeKey]) {
        nodeGroups[nodeKey]++;
      } else {
        nodeGroups[nodeKey] = 1;
      }

      //노드 위치
      nodes.push({
        x: nodePositions[nodeKey].x,
        y: nodePositions[nodeKey].y,
        name: nodeKey,
        size: nodeGroups[nodeKey] * 10,
      });

      //간선 위치치
      const targetNodeKey = `${pod.dst_ip}:${pod.dst_port}`;
      if (nodePositions[targetNodeKey]) {
        nodes.push({
          x: nodePositions[targetNodeKey].x,
          y: nodePositions[targetNodeKey].y,
          name: targetNodeKey,
          size: nodeGroups[targetNodeKey] * 10,
        });
        links.push({ source: nodeKey, target: targetNodeKey });
      }
    }


  // 파드(원) 클릭
  const handlePodClick = (pod: { x: number; y: number; name: string }) => {
    setSelectedPod(`${pod.name}\nsrc_ip: ${pod.name.split(':')[0]}\nsrc_port: ${pod.name.split(':')[1]}`);
    setSelectedEdge(null);
    setShowInfo(true);
  };

  //간선(화살표) 클릭
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
    <div className='content'>
      <XYPlot width={1300} height={640}>
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
