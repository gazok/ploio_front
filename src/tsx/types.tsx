export interface Data {
    src_pod: string;
    dst_pod: string;
    data_len: number;
    timestamp: number;
}

export interface PodData {
    name: string; // 복잡한 것.
    name_space: string;
    ip: string;
    danger_degree: string;
}
  
export interface JsonData {
    data: Data[];
}

export interface PodJsonData {
    data: PodData[];
}