import { START_SUBMISSIONS_DATE, STOP_SUBMISSIONS_DATE } from "./consts";

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
    date: new Date("2025-12-17T12:00:00.000+01:00"),
  },
  {
    key: "introductoryWebinar",
    date: START_SUBMISSIONS_DATE,
  },
  {
    key: "challengeStarts",
    date: START_SUBMISSIONS_DATE,
  },
  {
    key: "challengeEnds",
    date: STOP_SUBMISSIONS_DATE,
  },
  {
    key: "winnerAnnouncement",
    date: new Date("2026-01-16"),
  },
  {
    key: "closingCeremony",
    date: new Date("2026-01-21T00:00:00.000+01:00"),
  }
];

export default TIMELINE_EVENTS;
