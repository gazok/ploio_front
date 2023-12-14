/*
export const Logic = async (callback: (data: JsonData | null) => void, callback2: (plz: any) => void) => { // callback2: (ns_podname: string, pod_data: any)
    //callback(null);
    //callback(data);
    
    
    //'http://serverIp:Port/Path'
    const res: JsonData = await fetch('http://123.108.168.190:8000/summary/tmp/log_data.json', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    callback(res);

    const res2 = await fetch('http://123.108.168.190:8000/summary/tmp/pod_data.json', { // /summary/{edgeid}로 바꾸기.
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json());
    //console.log(res);
    //console.log(res2);
    const temp: PodData[] = [];
    res.data.forEach((item: Data) => {
        //console.log(res2[item.src_pod]);
        //callback2(item.src_pod, res2[item.src_pod]);
        //callback2(item.dst_pod, res2[item.dst_pod]);
        
        temp.push(res2[item.src_pod]);
        temp.push(res2[item.dst_pod]);

        
    });
    callback2(temp);
    

}

--------------------------------------------------
const podData = new Map(); // 포드들의 실제 데이터 모임
  const [pleaseData, setPleaseData] = useState<PodData[] | null>(null); // 포드들의 실제 데이터 모임2

  
Logic(res => setTdata(res), plz => setPleaseData(plz)); // (ns_podname, pod_data) => podData.set(ns_podname, pod_data)
    //console.log(tdata);
    let timer = setInterval(() => {
      Logic(res => setTdata(res), plz => setPleaseData(plz));
    }, 6000);


    console.log(tdata);
    //console.log(podData);
    console.log(pleaseData);



*/