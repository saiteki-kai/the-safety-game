import { STOP_SUBMISSIONS_DATE } from "./consts";

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
    date: new Date("2025-12-17"),
  },
  {
    key: "introductoryWebinar",
    date: new Date("2025-12-17"),
  },
  {
    key: "challengeStarts",
    date: new Date("2025-12-17"),
  },
  {
    key: "challengeEnds",
    date: STOP_SUBMISSIONS_DATE,
  },
  {
    key: "winnerAnnouncement",
    date: new Date("2026-01-16"),
  },
];

export default TIMELINE_EVENTS;
