import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDateTimeOrNull, formatDecimal, toISOStringIfValid } from "@/lib/formatters";
import type { TeamSubmissions } from "@/lib/supabase.types";
import { StatefulDataTable } from "./StatefulDataTable";

// TEMPORARY: Hardcoded Italian translations
const IT_HISTORY = {
  title: "Storico Submission",
  description: "Consulta i punteggi assegnati ad ogni prompt inviato dal tuo team.",
  columnPrompt: "Prompt",
  columnDate: "Ultimo invio",
  columnScore: "Punteggio",
  emptyTitle: "Nessun risultato",
  emptyDescription: "Non ci sono dati da mostrare.",
};

type SubmissionHistorySectionProps = {
  teamId?: string;
  submissions: TeamSubmissions[] | null;
};

export function SubmissionHistorySection({ submissions }: SubmissionHistorySectionProps) {
  // TEMPORARY: Using hardcoded Italian
  const isLoading = submissions === null;

  const submissionColumns: ColumnDef<TeamSubmissions>[] = [
    {
      accessorKey: "prompt",
      header: ({ column }) => <DataTableColumnHeader column={column} title={IT_HISTORY.columnPrompt} />,
      cell: ({ row }) => {
        const prompt = row.getValue("prompt") as string | null;
        return <span className="text-neutral-700 text-sm">{prompt ?? "—"}</span>;
      },
      enableSorting: true,
      size: undefined,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title={IT_HISTORY.columnDate} />,
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
      size: 160,
    },
    {
      accessorKey: "score",
      header: ({ column }) => <DataTableColumnHeader column={column} title={IT_HISTORY.columnScore} />,
      cell: ({ row }) => {
        const rawScore = row.getValue("score");
        const score = formatDecimal(rawScore, 1);
        return <span className="font-medium text-neutral-900 text-sm">{score}</span>;
      },
      enableSorting: true,
      size: 120,
    },
  ];

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">{IT_HISTORY.title}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{IT_HISTORY.description}</p>
      </div>

      <StatefulDataTable
        data={submissions}
        isLoading={isLoading}
        columns={submissionColumns}
        emptyTitle={IT_HISTORY.emptyTitle}
        emptyDescription={IT_HISTORY.emptyDescription}
      />
    </div>
  );
}
