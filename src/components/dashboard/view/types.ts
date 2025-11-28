import type { LucideIcon } from "lucide-react";

export type ProgressItem = {
  id: string;
  value: number;
  total?: number;
};

export type SubmissionStatus = {
  Icon: LucideIcon;
  message: string;
  className: string;
};
