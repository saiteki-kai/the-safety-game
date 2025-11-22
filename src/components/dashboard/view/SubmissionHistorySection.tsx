import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Upload } from "lucide-react";
import { useTeamSubmissions } from "@/hooks/useTeamSubmissions";
import { browserClient } from "@/lib/supabase";
import type { TeamSubmissions } from "@/lib/supabase.types";
import { formatDateTimeOrNull, toISOStringIfValid, formatDecimal } from "@/lib/formatters";
import { StatefulDataTable } from "./StatefulDataTable";

const submissionColumns: ColumnDef<TeamSubmissions>[] = [
  {
    accessorKey: "prompt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prompt" />,
    cell: ({ row }) => {
      const prompt = row.getValue("prompt") as string | null;
      return <span className="text-neutral-700 text-sm">{prompt ?? "—"}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ultimo invio" />,
    cell: ({ row }) => {
      const rawDate = row.getValue("date");
      const formatted = formatDateTimeOrNull(rawDate);
      return formatted ? (
        <time dateTime={toISOStringIfValid(rawDate)} className="text-neutral-700 text-sm">
          {formatted}
        </time>
      ) : (
        <span className="text-neutral-500 text-sm">—</span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Punteggio" />,
    cell: ({ row }) => {
      const rawScore = row.getValue("score");
      const score = formatDecimal(rawScore, 1);
      return <span className="font-medium text-neutral-900 text-sm">{score}</span>;
    },
    enableSorting: true,
  },
];

type SubmissionHistorySectionProps = {
  teamId: string;
};

export function SubmissionHistorySection({ teamId }: SubmissionHistorySectionProps) {
  const { submissions } = useTeamSubmissions(browserClient(), teamId);
  const isLoading = submissions === null;

  return (
    <Card className="w-full border-neutral-200">
      <CardHeader className="flex flex-col gap-3 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <CardTitle className="font-semibold text-lg text-neutral-900">Storico submission</CardTitle>
          <CardDescription className="text-neutral-500 text-sm">
            Consulta gli invii effettuati finora e monitora l&apos;assegnazione dei punteggi.
          </CardDescription>
        </div>
        <Button type="button" aria-label="Invia prompt" variant="outline" onClick={() => { }}>
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span className="ml-2 font-medium">Invia prompt</span>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <StatefulDataTable data={submissions} isLoading={isLoading} columns={submissionColumns} />
      </CardContent>
    </Card>
  );
}
