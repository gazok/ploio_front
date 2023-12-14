//notice.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {  Divider, Input } from '@fluentui/react-components';
import { Line } from 'react-chartjs-2';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import '../css/Notice.css';
import '../css/App.css';
import { Data, JsonData, NoticeData, NoticeJsonData, NoticeAnalysisData, NoticeAnalysisJsonData } from './types';
import data from '../public/data.json';
import data3 from '../public/data3.json';
import data_notice from '../public/data_notice.json';
import {ErrorCircle16Regular, Warning16Regular, PresenceBlocked12Regular, ChevronUp20Regular, ChevronDown20Regular, CircleFilled } from '@fluentui/react-icons';

const LogicNotice = async (callback: (data: any) => void, callback2: (data: any) => void, callback3: (data: any) => void) => {
  /*
  const res: JsonData = await fetch('http://3.25.167.109:80/summary/operation', { // /summary/{edgeid}로 바꾸기.
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());
  callback(res);*/
  callback(data);

  /*
  //2
  const res2 = await fetch('http://3.25.167.109:80/notice', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());
  callback2(res2);*/
  callback2(data3);

  /*
  //3
  const res3 = await fetch('http://3.25.167.109:80/notice-analysis', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.json());
  callback3(res3);*/
  callback3(data_notice);
  return;
}

const Notice = (Props) => {

  const [tdata, setTdata] = useState<JsonData | null>(null); 
  const [noticeData, setNoticeData] = [Props.noticeData, Props.setNoticeData]; //수정
  const [noticeAnalysisData, setNoticeAnalysisData] = useState<NoticeAnalysisJsonData | null>(null);
  const [allNoticeData, setAllNoticeData] = [Props.allNoticeData, Props.setAllNoticeData]; //수정

  //차트
  const [chartData, setChartData] = useState<any>(null); 
  const [packetChartData, setPacketChartData] = useState<{ labels: string[], datasets: { label: string, data: number[], backgroundColor: string }[] }>({
    labels: [],
    datasets: [
      { label: 'Total Packet', data: [], backgroundColor: 'black' },
      { label: 'Anomaly Packet', data: [], backgroundColor: 'red' },
      { label: 'Normal Packet', data: [], backgroundColor: 'green' }
    ]
  });

  //리스트
  const [expanded, setExpanded] = useState({});
  const [highlighted, setHighlighted] = useState({});
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');  
  const [firstClick, setFirstClick] = useState(true);

  useEffect(() => {
    LogicNotice(setTdata, setNoticeData, setNoticeAnalysisData);
    let timer = setInterval(() => {
        LogicNotice(setTdata, setNoticeData, setNoticeAnalysisData);
      }, 6000);
    return () => {
      clearInterval(timer);
    }
  }, []);  

//malicious, secure 패킷 수 비교
  useEffect(() => {
    if (!tdata?.packets || !noticeData?.notices) {
        console.log('empty');
        return; 
    }        
  
    const totalPacket = Array.isArray(tdata.packets) ? tdata.packets.length : 0; 
    const anomalyPacket = Array.isArray(noticeData.notices) ? noticeData.notices.length : 0;  
    const normalPacket = totalPacket - anomalyPacket;
  
    setPacketChartData(prevData => {
        const totalData = prevData.datasets[0]?.data || [];
        const anomalyData = prevData.datasets[1]?.data || [];
        const normalData = prevData.datasets[2]?.data || [];
        const timestamp = tdata.packets[tdata.packets.length - 1]?.timestamp;
      
        return {
          labels: timestamp ? [...prevData.labels, timestamp] : prevData.labels,
          datasets: [
            {
              label: 'Total Packet',
              data: totalPacket > 0 ? [...totalData, totalPacket] : totalData,
              backgroundColor: 'black',
            },
            {
              label: 'Anomaly Packet',
              data: anomalyPacket > 0 ? [...anomalyData, anomalyPacket] : anomalyData,
              backgroundColor: 'red',
            },
            {
              label: 'Normal Packet',
              data: normalPacket > 0 ? [...normalData, normalPacket] : normalData,
              backgroundColor: 'green',
            },
          ]
        };
      });
  }, [tdata, noticeData]);

  //malicious 종류 비교
  useEffect(() => {
    if (!noticeAnalysisData || typeof noticeAnalysisData !== 'object') {
        return; 
    }

    const labels = Object.keys(noticeAnalysisData);
    const warningData = labels.map(label => noticeAnalysisData[label].Warning);
    const failData = labels.map(label => noticeAnalysisData[label].Fail);
    const criticalData = labels.map(label => noticeAnalysisData[label].Critical);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Warning',
          data: warningData,
          borderColor: 'orange'
        },
        {
          label: 'Fail',
          data: failData,
          borderColor: 'black',
        },
        {
          label: 'Critical',
          data: criticalData,
          borderColor: 'red',
        }
      ]
    });
  }, [noticeAnalysisData]);

  //malicious packet list
  const onToggle = (index, currentHighlight) => {
    setExpanded(prevState => {
      const isExpanded = !prevState[index];
      
      if (highlighted[index] || currentHighlight) {
        setFirstClick(false);
      }
  
      return { ...prevState, [index]: isExpanded };
    });
  };

  const renderData = (data, index = '0', highlight = false) => {
    return Object.entries(data).map(([key, value], idx) => {
      const currentIndex = `${index}-${idx+1}`;
      const isNoticeData = value && typeof value === 'object' && 'packet_id' in value; 
      const currentHighlight = Boolean(isNoticeData && String(value.packet_id) === id);
      const highlightStyle = (!expanded[currentIndex] && firstClick && (highlighted[currentIndex] || currentHighlight)) ? { backgroundColor: '#FFC6C6' } : {};
    
      if (value && typeof value === 'object') { 
        const status = value['danger_degree'] ? value['danger_degree'] : '';
        const timestamp = value['timestamp'] ? value['timestamp'] : '';
        const message = value['message'] ? value['message'] : '';
        let color;
        let icon;
        switch (status) {
          case 'fail': 
            color = 'black';
            icon = <ErrorCircle16Regular color={color}/>
            break;
          case 'critical':
            color = 'red';
            icon = <PresenceBlocked12Regular color={color} />
            break;
          case 'warning':
            color = 'orange';
            icon = <Warning16Regular color={color}/>
            break;
          default:
            color = 'grey';
        }
  
        return (
          <div onClick={() => onToggle(currentIndex, currentHighlight)}>
            <div key={currentIndex} style={{...highlightStyle, border: '1px solid black', borderLeft:`5px solid ${color}`, margin: '10px', position: 'relative', width: '600px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}} >                 
                <p style={{ marginLeft: '5px'}}>{icon} {`[${status}] ${message}`}</p>
                {!expanded[currentIndex] && <p style={{ fontSize: '10px', position: 'absolute', right: '20px', bottom: 0 }}>{`${timestamp}`}</p>}
                {expanded[currentIndex] ? <ChevronUp20Regular style={{ marginTop: '15px' }} /> : <ChevronDown20Regular style={{ marginTop: '15px' }} />}
              </div>
              {expanded[currentIndex] && 
                <div style={{overflow: 'auto', maxHeight: '80px', marginLeft: '10px'}}> 
                  {renderData(value, currentIndex, currentHighlight)}
                </div>
              }
            </div>
          </div>
          );
        } else {
          return <p key={currentIndex}><CircleFilled style={{ fontSize: '5px', marginRight: '5px', marginBottom: '2px' }} />{`${key}: ${value}`}</p>;
        }
      });
    };

  return (
    <div className='content' style={{ display: 'flex' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ddd', marginLeft: '20px' }}>
        <div style={{ marginTop: '45px', width: '80%' }}>
          <h3>Packet Analysis</h3>
          {packetChartData && <Line data={packetChartData} />}
        </div>
        <div style={{ marginTop: '10px', width: '80%' }}>
          <h3>Notice Analysis</h3>
          {chartData && <Line data={chartData} />}
        </div>
      </div>
      <div style={{ flex: 1, paddingLeft: '20px', overflow: 'auto', maxHeight: '100vh' }}>
      <div style={{ marginTop: '45px', width: '80%' }}>
        <h3>Notice Information</h3> {/*수정*/}
        {allNoticeData && allNoticeData.length > 0 ? 
          allNoticeData.flatMap((data, idx) => 
            Object.entries(data).map(([key, value]) => {
              const noticeData = value as NoticeData;
              return renderData(noticeData, `${idx}-${key}`, String(noticeData.packet_id) === id);
            })
          )
        : <p>No data</p>}
      </div>
    </div>
    </div>
  );
 }

const NoticeM: React.FC = () => {

  const [noticeData, setNoticeData] = useState<NoticeJsonData | null>(null); 
  const [noticeAnalysisData, setNoticeAnalysisData] = useState<NoticeJsonData | null>(null);
  const [noticeSearchData, setNoticeSearchData] = useState<NoticeJsonData[] | null>(null);
  const [allNoticeData, setAllNoticeData] = useState<NoticeJsonData[]>([]); //추가

  //추가
  useEffect(() => {
    if (noticeData) {
      setAllNoticeData(prevData => [...prevData, noticeData]);
    }
  }, [noticeData]);

  //search
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  const handleSearch = () => {

  };  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    setInputValue('');
    if(noticeData) {
      setNoticeData(noticeData);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handleSearch();
    }
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
      key: 'reset',
      text: 'Reset',
      iconProps: { iconName: 'Refresh' },
      onClick: () => handleReset(),
    },
    {
      key: 'div1-3',
      onRender: () => <Divider vertical/>
    }
  ]; //<CommandBar items={commandBarItems}></CommandBar>


  const MBar = () => {
    return (
      <div className="notice-menu">
        <div style={{marginLeft: '15px'}}>
          <Input ref={inputRef} type="text" placeholder="Search..." value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} />
        </div>
        <CommandBar items={commandBarItems} />      
      </div>
    );
  };
  
  return (
    <div>
      <MBar />
      <Notice allNoticeData={allNoticeData} setAllNoticeData={setAllNoticeData} noticeData={noticeData} setNoticeData={setNoticeData} noticeAnalysisData={noticeAnalysisData} setNoticeAnalysisData={setNoticeAnalysisData} noticeSearchData={noticeSearchData} setNoticeSearchData={setNoticeSearchData} /> {/*수정*/}
    </div>
  );
}

export { Notice, NoticeM };
