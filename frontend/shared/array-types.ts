export interface EventSeries {
    id: string;
    name: string;
    eventTypeId: string;
    region: string;
    date: string; // use ISO string for JSON transport; parse to Date when needed
    EventTimelineId: string;
}

export type EventSeriesArray = EventSeries[];