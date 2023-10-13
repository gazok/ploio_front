//Operation.tsx
//Ops 부문 가시화
//수정 중중

import React, { useState } from 'react';
import { XYPlot, MarkSeries, LineSeries } from 'react-vis';
import data from './data.json';
import './App.css';
import './Summary.css';
import { VscExport } from 'react-icons/vsc';

interface PodData {
  [podName: string]: {
    [key: string]: any; // 모든 데이터 유형을 수용하는 더 유연한 타입
  };
}

const Operation: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);

  // Extract Pod data from data.json
  const podData: PodData = data.Data;

  // Extract Pod names
  const podNames = Object.keys(podData);

  // Extracting data for react-vis
  const nodes: { x: number; y: number; name: string }[] = [];
  const links: { source: string; target: string }[] = [];

  for (const podName of podNames) {
    const pod = podData[podName];
    nodes.push({
      x: Math.random() * 400,
      y: Math.random() * 200,
      name: podName,
    });

    if (pod.Dest) {
      links.push({ source: podName, target: pod.Dest });
    }
  }

  // Click handlers
  const handlePodClick = (pod: { x: number, y: number, name: string }) => {
    setSelectedPod(pod.name);
    setShowInfo(true);
  };

  const handleArrowClick = (sourcePod: string, destPod: string) => {
    setSelectedPod(`Communication from ${sourcePod} to ${destPod}`);
    setShowInfo(true);
  };

  const renderMarkSeries = () => {
    return nodes.map((node) => (
      <MarkSeries
        key={node.name}
        data={[node]}
        onValueClick={() => handlePodClick(node)}
      />
    ));
  };

  const renderLineSeries = () => {
    return links.map((link, index) => (
      <LineSeries
        key={index}
        data={[
          nodes.find((n) => n.name === link.source)!,
          nodes.find((n) => n.name === link.target)!,
        ]}
      />
    ));
  };

  return (
    <div className='content'>
      <XYPlot width={800} height={400}>
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
            <p className='metadata'>
              {selectedPod ? `Name: ${selectedPod}` : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operation;