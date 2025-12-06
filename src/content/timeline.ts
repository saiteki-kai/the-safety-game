export interface TimelineEvent {
    date: Date;
    time?: string;
    key: string;
}

export type TimelineStatus = "completed" | "upcoming";

export interface TimelineEntry {
    date: string;
    time?: string;
    title: string;
    description: string;
    status: TimelineStatus;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        key: "registrationOpens",
        date: new Date("2025-11-01"),
    },
    {
        key: "introductoryWebinar",
        date: new Date("2025-11-18"),
    },
    {
        key: "challengeStarts",
        date: new Date("2025-11-20"),
    },
    {
        key: "challengeEnds",
        date: new Date("2025-11-30"),
    },
    {
        key: "winnerAnnouncement",
        date: new Date("2025-12-05"),
    },
];

export default TIMELINE_EVENTS;
