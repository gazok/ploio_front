/*
fetch('http://127.0.0.1:8000/summary/tmp', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
        if(response.ok){
            //alert("응답 성공함");
            success = true;
        }
        else{
            //alert("응답 실패함");
            success = false;
        }
        return response.json();}).then(response => {
        if(success){
            alert("응답 성공함");
            jsonData = response;

            
            
            let p1 = document.getElementById("ptest1");
            if(p1){
                //p1.innerHTML = JSON.stringify(jsonData);
                p1.innerHTML = JSON.stringify(jsonData.data[1]);
            }
            console.log(jsonData);
        }
        else{
            alert("응답 실패함");
        }
    });
interface Data {
  src_ip: string;
  src_port: number;
  dst_ip: string;
  dst_port: number;
  data_len: number;
  protocol: string;
  timestamp: number;
}
*/