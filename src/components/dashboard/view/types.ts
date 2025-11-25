import type { LucideIcon } from "lucide-react";

export type ProgressItem = {
  id: string;
  label: string;
  value: number;
  total?: number;
  percentage?: number;
};

export type SubmissionStatus = {
  Icon: LucideIcon;
  message: string;
  className: string;
};
