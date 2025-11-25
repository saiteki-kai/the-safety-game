import type { ProgressItem } from "./types";

export type ProgressItemProps = {
  item: ProgressItem
};

export default function ProgressMetricRow({ item }: ProgressItemProps) {
  const { id, label, value, total } = item;

  return (
    <div key={id} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-700 text-sm">{label}</span>
        <span className="font-bold text-neutral-900 text-sm">
          {total != null ? `${value}/${total}` : value}
        </span>
      </div>
    </div>
  );
}
