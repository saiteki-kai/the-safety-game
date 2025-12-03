import type { ReactNode } from "react";

export type ProgressMetricRowProps = {
  label: string;
  value: number;
  total?: number;
  icon?: ReactNode;
};

export default function ProgressMetricRow({ label, value, total, icon }: ProgressMetricRowProps) {
  const displayValue = total != null ? `${value}/${total}` : String(value);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
      {icon ? <div className="shrink-0">{icon}</div> : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-700 text-sm">{label}</span>
          <span className="font-bold text-neutral-900 text-sm">{displayValue}</span>
        </div>
      </div>
    </div>
  );
}
