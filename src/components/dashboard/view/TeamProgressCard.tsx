import { Alert, AlertDescription } from "@components/ui/alert";
import { Progress } from "@components/ui/progress";
import type { LucideIcon } from "lucide-react";

type TeamProgressCardProps = {
  progressItems: ProgressItem[];
  submissionStatus: SubmissionStatus;
};

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

export default function TeamProgressCard({ progressItems, submissionStatus }: TeamProgressCardProps) {
  const { Icon } = submissionStatus;

  return (
    <div className="space-y-8 px-8 py-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">Progressi del Team</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Monitora l'avanzamento della challenge e lo stato delle submission
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="space-y-6 lg:flex-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-lg text-neutral-800">Metriche di Progresso</h3>
            <div className="space-y-6">
              {progressItems.map(({ id, label, value, total, percentage }) => (
                <div key={id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-700 text-sm">{label}</span>
                    <span className="font-bold text-neutral-900 text-sm">
                      {typeof total === "number" ? `${value}/${total}` : value}
                    </span>
                  </div>
                  {typeof percentage === "number" && (
                    <div className="space-y-2">
                      <Progress
                        value={percentage}
                        className="h-3 rounded-full bg-neutral-100"
                      />
                      <div className="text-right">
                        <span className="text-xs font-medium text-neutral-500">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:flex-1">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-amber-800">Stato Submission</h3>
            <Alert className={`${submissionStatus.className} rounded-lg px-4 py-3 border-0`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              <AlertDescription className="text-sm font-medium">{submissionStatus.message}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
