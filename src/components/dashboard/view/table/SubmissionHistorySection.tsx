import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import { getTranslations, historyTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDateTimeOrNull, formatDecimal, toISOStringIfValid } from "@/lib/formatters";
import type { TeamSubmissions } from "@/lib/supabase.types";
import { StatefulDataTable } from "./StatefulDataTable";

type SubmissionHistorySectionProps = {
  teamId?: string;
  submissions: TeamSubmissions[] | null;
  locale?: Locale;
};

export function SubmissionHistorySection({ submissions, locale = DEFAULT_LOCALE }: SubmissionHistorySectionProps) {
  const t = getTranslations(historyTranslations, locale);
  const isLoading = submissions === null;

  const submissionColumns: ColumnDef<TeamSubmissions>[] = [
    {
      accessorKey: "prompt",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.columnPrompt} />,
      cell: ({ row }) => {
        const prompt = row.getValue("prompt") as string | null;
        return <span className="text-neutral-700 text-sm">{prompt ?? "—"}</span>;
      },
      enableSorting: true,
      size: undefined,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.columnDate} />,
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t.columnScore} className="text-center" />
      ),
      cell: ({ row }) => {
        const rawScore = row.getValue("score");
        const score = Math.round(Number(rawScore) * 100);
        return (
          <div className="text-center">
            <span className="font-medium text-neutral-900 text-sm">{score}</span>
          </div>
        );
      },
      enableSorting: true,
      size: 120,
    },
  ];

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">{t.title}</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">{t.description}</p>
      </div>

      <StatefulDataTable
        data={submissions}
        isLoading={isLoading}
        columns={submissionColumns}
        emptyTitle={t.emptyTitle}
        emptyDescription={t.emptyDescription}
      />
    </div>
  );
}

export default SubmissionHistorySection;
