import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { useTeamSubmissions } from "@/hooks/useTeamSubmissions";
import { formatDateTimeOrNull, formatDecimal, toISOStringIfValid } from "@/lib/formatters";
import { browserClient } from "@/lib/supabase";
import type { TeamSubmissions } from "@/lib/supabase.types";
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
    <div className="space-y-8 px-8 py-8">
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">Storico Submission</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Consulta i punteggi assegnati ad ogni prompt inviato dal tuo team.
        </p>
      </div>

      <StatefulDataTable data={submissions} isLoading={isLoading} columns={submissionColumns} />
    </div>
  );
}
