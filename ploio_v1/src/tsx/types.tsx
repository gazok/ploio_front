export interface Data {
    src: string;
    dst: string;
    data_len: number;
}

export interface PodData {
    name: string; // 복잡한 것.
    label: string;
    ip: string;
    port: number;
    critical: number;
}
  
export interface JsonData {
    data: Data[];
}

export interface PodJsonData {
    data: PodData[];
}