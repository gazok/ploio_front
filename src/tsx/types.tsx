export interface Data { //수정
    packet_id: string;
    src_pod: string;
    dst_pod: string;
    timestamp: string;
    data_len: number;
}

export interface PodData { //수정
    id: string;
    name: string; // 복잡한 것.
    name_space: string;
    type: string;
    ip: string;      
    danger_degree: string;
    message: string;
}

export interface SecurityData { //수정
    packet_id: string;
    src_pod: string; 
    dst_pod: string;
    timestamp: string;
    data_len: number;
    danger_degree: string;
    message: string;
}

export interface ModuleData {
    GUID: string;
	Name: string;
	Description: string;
	status: string;
}

export interface NoticeData { //추가
    Warnig: number;
    Fail: number;
    Critical: number;
}

export interface JsonData {
    data: Data[];
}

export interface PodJsonData {
    data: PodData[];
}

export interface SecurityJsonData { 
    data: SecurityData[];
}

export interface ModuleJsonData {
    modules: ModuleData[];
}

export interface NoticeJsonData {
    [timestamp: string]: NoticeData;
}
