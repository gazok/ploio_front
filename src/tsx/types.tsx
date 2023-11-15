export interface Data {
    src_pod: string;
    dst_pod: string;
    data_len: number;
}

export interface PodData {
    name: string; // 복잡한 것.
    namespace: string;
    ip: string;
    danger_degree: number;
}
  
export interface JsonData {
    data: Data[];
}

export interface PodJsonData {
    data: PodData[];
}