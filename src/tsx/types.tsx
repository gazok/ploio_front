export interface Data {
    src_pod: string;
    dst_pod: string;
    data_len: number;
    timestamp: string;
}

export interface PodData {
    name: string; // 복잡한 것.
    name_space: string;
    ip: string;
    danger_degree: string;
}

export interface SecurityData { //추가
    src_pod: string; 
    dst_pod: string;
    danger_degree: string;
    message: string;
    packet_id: string;
    timestamp: string;
}
  
export interface JsonData {
    data: Data[];
}

export interface PodJsonData {
    data: PodData[];
}

export interface SecurityJsonData { //추가
    data: SecurityData[];
}