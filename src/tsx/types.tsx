export interface Data { 
    packet_id: string;
    src_pod: string;
    dst_pod: string;
    timestamp: string;
    data_len: number;
}

export interface PodData { 
    id: string;
    name: string; // 복잡한 것.
    name_space: string;
    type: string;
    ip: string;      
    danger_degree: string;
    message: string;
}

export interface NoticeData { 
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

export interface NoticeAnalysisData { 
    Warning: number;
    Fail: number;
    Critical: number;
}

export interface JsonData { //수정
    packets: Data[];
}

export interface PodJsonData { //수정
    pods: { [name: string]: PodData }[];
}

export interface NoticeJsonData { //수정
    notices: NoticeData[];
}

export interface ModuleJsonData {
    modules: ModuleData[];
}

export interface NoticeAnalysisJsonData {
    [timestamp: string]: NoticeAnalysisData;
}
