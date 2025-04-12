export interface OcrWord {
    text: string;
    boundingBox: number[];
    confidence?: number;
}

export interface OcrLine {
    text: string;
    boundingBox: number[];
    words: OcrWord[];
}

export interface OcrReadResult {
    page: number;
    angle: number;
    width: number;
    height: number;
    unit: string;
    lines: OcrLine[];
}

export interface OcrAnalyzeResult {
    version: string;
    readResults: OcrReadResult[];
}

export interface OcrStatusResponse {
    status: 'notStarted' | 'running' | 'failed' | 'succeeded';
    createdDateTime: string;
    lastUpdatedDateTime: string;
    analyzeResult?: OcrAnalyzeResult;
}
