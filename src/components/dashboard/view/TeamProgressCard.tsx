import { Alert, AlertDescription } from "@components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Progress } from "@components/ui/progress";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";

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
    <Card className="flex h-full min-h-0 w-full flex-col">
      <CardHeader className="space-y-1 pb-0">
        <CardTitle className="text-lg text-neutral-900">Progressi del team</CardTitle>
        <CardDescription className="text-neutral-500 text-sm">
          Aggiorna gli stati per monitorare l&apos;avanzamento verso la challenge.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-4 pt-3">
        <div className="grid gap-3 lg:grid-cols-2">
          {progressItems.map(({ id, label, value, total, percentage }) => (
            <div key={id} className="space-y-2 rounded-md border border-neutral-200 bg-white/50 p-3">
              <div className="flex items-center justify-between text-neutral-500 text-xs uppercase tracking-wide">
                <span>{label}</span>
                {typeof total === "number" ? (
                  <span className="font-semibold text-neutral-900 text-sm normal-case">
                    {value} / {total}
                  </span>
                ) : (
                  <span className="font-semibold text-neutral-900 text-sm normal-case">{value}</span>
                )}
              </div>
              {typeof percentage === "number" && (
                <Progress value={percentage} className="h-2.5 rounded-full bg-neutral-100" />
              )}
            </div>
          ))}
        </div>

        <Alert className="flex items-start gap-3 border-amber-100 bg-amber-50/80 text-amber-700">
          <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-amber-700 text-xs">
            Assicurati di leggere attentamente le istruzioni prima di procedere con la submission. Errori nel formato o
            contenuto possono causare rifiuti.
          </AlertDescription>
        </Alert>

        <Alert className={`${submissionStatus.className} rounded-md px-3 py-2`}>
          <Icon className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-xs">{submissionStatus.message}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
