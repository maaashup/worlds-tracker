export interface IEventDetailsSummary {
    name: string;
    regionCode: string;
    eventDate: string;
    eventType: string;
    formats: string[];
}

export interface IEventSummary {
    id: string;
    event: string;
    date: string;
    region: string;
    eventType: string;
    formats: string[];
    results: playerResults[];
}

export interface playerResults {
    id: string;
    bushiNaviId: string;
    playerName: string;
    formatCode: string;
    rank: number;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
    invTakenHere: boolean;
}

export type IEventSummaryArray = IEventSummary[];