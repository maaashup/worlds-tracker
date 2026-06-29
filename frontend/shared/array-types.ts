interface EventSeries {
    id: string;
    name: string;
    eventTypeId: string;
    region: string;
    date: string; // use ISO string for JSON transport; parse to Date when needed
    EventTimelineId: string;
}

export type EventSeriesArray = EventSeries[];

interface IEventSummary {
    id: string;
    event: string;
    date: string;
    region: string;
    eventType: string;
    results: playerResults[];
}

interface playerResults {
    bushiNaviId: string;
    playerName: string;
    formatCode: string;
    rank: number;
    isSponsored: boolean;
    isFormComplete: boolean;
    isQualified: boolean;
}

export type IEventSummaryArray = IEventSummary[];