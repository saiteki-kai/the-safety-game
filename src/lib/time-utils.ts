/**
 * Time utility functions to prevent hydration mismatches
 * by computing time-dependent values on the server and passing them to client
 */

import { STOP_SUBMISSIONS_DATE } from "@/content/consts";

/**
 * Calculate days remaining until submissions stop
 * Should be called on server-side to get consistent value across SSR/client boundary
 * @param currentTime Optional time to calculate from (defaults to now)
 * @returns Number of days remaining, 0 if deadline has passed
 */
export function calculateChallengeDaysRemaining(currentTime: Date = new Date()): number {
  const timeUntilStop = STOP_SUBMISSIONS_DATE.getTime() - currentTime.getTime();
  if (timeUntilStop <= 0) return 0;
  return Math.ceil(timeUntilStop / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is today
 * Should be called on server-side to get consistent value across SSR/client boundary
 * @param date Date to check
 * @param referenceDate Optional reference date (defaults to now)
 * @returns true if the date is today, false otherwise
 */
export function isTodayAt(date: Date, referenceDate: Date = new Date()): boolean {
  return (
    date.getUTCFullYear() === referenceDate.getUTCFullYear() &&
    date.getUTCMonth() === referenceDate.getUTCMonth() &&
    date.getUTCDate() === referenceDate.getUTCDate()
  );
}

/**
 * Check if challenge submissions are still open
 * @param currentTime Optional time to check against (defaults to now)
 * @returns true if submissions are still open
 */
export function isChallengOpenAt(currentTime: Date = new Date()): boolean {
  return currentTime.getTime() < STOP_SUBMISSIONS_DATE.getTime();
}
