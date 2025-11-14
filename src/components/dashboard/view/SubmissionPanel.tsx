import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@components/ui/empty";
import { Skeleton } from "@components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Inbox, Upload } from "lucide-react";
import { useTeamSubmissions } from "@/hooks/useTeamSubmissions";
import type { TeamSubmissions } from "@/lib/supabase.types";
import { cn } from "@/lib/utils";
import { browserClient } from "@/lib/supabase";

type SubmissionPanelProps = {
  teamId: string;
  isReadyToSubmit: boolean;
};

export default function SubmissionPanel({ teamId, isReadyToSubmit }: SubmissionPanelProps) {
  const { submissions } = useTeamSubmissions(browserClient(), teamId);

  return (
    <Card className="flex h-[640px] min-h-0 w-full flex-col lg:h-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-neutral-900 lg:text-xl">Le mie submission</CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Qui troverai gli invii effettuati e il loro punteggio assegnato non appena saranno disponibili.
            </CardDescription>
          </div>
          <div className="flex items-center lg:pl-4">
            <Button
              type="button"
              aria-label="Invia prompt"
              className="flex w-full items-center justify-center gap-2 lg:w-auto"
              disabled={!isReadyToSubmit}
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium">Invia Prompt</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative min-h-0 flex-1 overflow-hidden px-6 py-2">
        <div className="relative h-full min-h-0">
          {submissions === null ? (
            <SubmissionsTableSkeleton />
          ) : submissions.length ? (
            <SubmissionsDataTable data={submissions} />
          ) : (
            <SubmissionsEmptyState />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const submissionColumns: ColumnDef<TeamSubmissions>[] = [
  {
    accessorKey: "prompt",
    header: "Prompt",
    cell: ({ row }) => {
      const prompt = row.getValue("prompt") as string | null;

      return <span className="max-w-[320px] truncate text-neutral-700 text-sm">{prompt ?? "—"}</span>;
    },
  },
  {
    accessorKey: "date",
    header: "Ultimo invio",
    cell: ({ row }) => {
      const rawDate = row.getValue("date");
      const formatted = formatSubmissionDate(rawDate);

      return formatted ? (
        <time dateTime={getISOString(rawDate)} className="text-neutral-700 text-sm">
          {formatted}
        </time>
      ) : (
        <span className="text-neutral-500 text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Punteggio",
    cell: ({ row }) => {
      const rawScore = row.getValue("score");
      const score = formatSubmissionScore(rawScore);

      return <span className="font-medium text-neutral-900 text-sm">{score}</span>;
    },
  },
];

function SubmissionsDataTable({ data }: { data: TeamSubmissions[] }) {
  const table = useReactTable({
    data,
    columns: submissionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="absolute inset-0 min-h-0 flex-1 overflow-hidden rounded-md border border-neutral-200 bg-white">
        <div className="h-full overflow-y-auto">
          <Table noWrapper className="min-w-full table-fixed">
            <TableHeader className="sticky top-0 z-20 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-background">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        tableHeaderBaseClasses,
                        columnWidthMap[header.column.id],
                        header.column.id === "prompt" && "text-left",
                        header.column.id === "date" && "text-center",
                        header.column.id === "score" && "text-center",
                      )}
                      scope="col"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={tableRowClasses}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(tableCellBaseClasses, columnWidthMap[cell.column.id])}>
                      {cell.column.id === "prompt" ? (
                        <span className="block min-w-0 truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "block",
                            cell.column.id === "date" && "text-center",
                            cell.column.id === "score" && "text-center font-medium text-neutral-900",
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function SubmissionsTableSkeleton() {
  return (
    <div className="absolute inset-0 flex min-h-0 flex-col overflow-hidden">
      <div className="h-full max-h-[400px] overflow-y-auto rounded-md border border-neutral-200 bg-white">
        <Table noWrapper className="relative min-w-full table-fixed">
          <TableHeader className="sticky top-0 z-20 bg-secondary/90">
            <TableRow>
              <TableHead className="py-2 text-left font-semibold text-neutral-200 text-xs uppercase tracking-[0.08em]">
                <Skeleton className={cn("h-4 bg-neutral-700", skeletonWidths.prompt)} />
              </TableHead>
              <TableHead className="w-[164px] py-2 text-center font-semibold text-neutral-200 text-xs uppercase tracking-[0.08em]">
                <Skeleton className={cn("mx-auto h-4 bg-neutral-700", skeletonWidths.date)} />
              </TableHead>
              <TableHead className="w-[104px] py-2 text-center font-semibold text-neutral-200 text-xs uppercase tracking-[0.08em]">
                <Skeleton className={cn("mx-auto h-4 bg-neutral-700", skeletonWidths.score)} />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {skeletonRowKeys.map((key) => (
              <TableRow key={key} className="border-neutral-200/80">
                <TableCell className="py-2 align-middle text-neutral-700 text-sm">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="w-[164px] py-2 text-center align-middle text-neutral-700 text-sm">
                  <Skeleton className={cn("mx-auto h-4", skeletonWidths.date)} />
                </TableCell>
                <TableCell className="w-[104px] py-2 text-center align-middle font-medium text-neutral-900 text-sm">
                  <Skeleton className={cn("mx-auto h-4", skeletonWidths.score)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SubmissionsEmptyState() {
  return (
    <Empty className="flex h-full min-h-[200px] flex-col justify-center border border-neutral-200 bg-neutral-50/40">
      <EmptyContent>
        <EmptyMedia variant="icon">
          <Inbox className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>Nessuna submission registrata</EmptyTitle>
        <EmptyDescription>
          Invia il primo prompt per vedere qui lo storico delle tue submission e monitorarne lo stato.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

function parseDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  const parsed = typeof value === "number" ? new Date(value) : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatSubmissionDate(value: unknown): string | null {
  const parsed = parseDate(value);
  return parsed ? submissionDateFormatter.format(parsed) : null;
}

function getISOString(value: unknown): string | undefined {
  const parsed = parseDate(value);
  return parsed ? parsed.toISOString() : undefined;
}

function formatSubmissionScore(value: unknown): string {
  const num = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(num) ? num.toFixed(1) : "—";
}

const submissionDateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short",
});

const skeletonRowKeys = Array.from({ length: 8 }, (_, index) => `skeleton-row-${index}`);

// Table configuration constants
const columnWidthMap: Record<string, string> = {
  prompt: "min-w-0",
  date: "w-[164px]",
  score: "w-[104px]",
};

const tableHeaderBaseClasses =
  "border-neutral-200 border-b py-2 font-semibold text-[0.7rem] text-neutral-500 uppercase tracking-[0.08em]";
const tableCellBaseClasses = "py-2 align-middle text-neutral-700 text-sm";
const tableRowClasses = "border-neutral-200/80 hover:bg-neutral-50";

// Skeleton configuration
const skeletonWidths = {
  prompt: "w-40",
  date: "w-28",
  score: "w-20",
};
