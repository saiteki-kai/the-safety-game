import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@components/ui/empty";
import { Skeleton } from "@components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Inbox, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { getTeamSubmissions } from "@/api/submissions";
import type { TeamSubmissions } from "@/lib/supabase.types";
import { cn } from "@/lib/utils";

type SubmissionPanelProps = {
  teamId: string;
  isReadyToSubmit: boolean;
};

export default function SubmissionPanel({ teamId, isReadyToSubmit }: SubmissionPanelProps) {
  const [submissions, setSubmissions] = useState<TeamSubmissions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmissions = async () => {
      if (!isMounted) {
        return;
      }

      setLoading(true);

      try {
        const supabase = (await import("@/lib/supabase")).browserClient();
        const data = await getTeamSubmissions(supabase, teamId);

        if (isMounted) {
          setSubmissions(data ?? []);
        }
      } catch (error) {
        console.error("Failed to load submissions", error);

        if (isMounted) {
          setSubmissions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();

    return () => {
      isMounted = false;
    };
  }, [teamId]);

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
          {loading ? (
            <SubmissionsTableSkeleton />
          ) : submissions.length ? (
            <SubmissionsDataTable data={submissions} />
          ) : (
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

  const columnWidthMap: Record<string, string> = {
    prompt: "min-w-0",
    date: "w-[164px]",
    score: "w-[104px]",
  };

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
                        "border-neutral-200 border-b py-2 font-semibold text-[0.7rem] text-neutral-500 uppercase tracking-[0.08em]",
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className="border-neutral-200/80 hover:bg-neutral-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn("py-2 align-middle text-neutral-700 text-sm", columnWidthMap[cell.column.id])}
                      >
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={submissionColumns.length} className="py-6 text-center text-neutral-500 text-sm">
                    Nessuna submission registrata
                  </TableCell>
                </TableRow>
              )}
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
                <Skeleton className="h-4 w-40 bg-neutral-700" />
              </TableHead>
              <TableHead className="w-[164px] py-2 text-center font-semibold text-neutral-200 text-xs uppercase tracking-[0.08em]">
                <Skeleton className="mx-auto h-4 w-28 bg-neutral-700" />
              </TableHead>
              <TableHead className="w-[104px] py-2 text-center font-semibold text-neutral-200 text-xs uppercase tracking-[0.08em]">
                <Skeleton className="mx-auto h-4 w-24 bg-neutral-700" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map((n) => (
              <TableRow key={`${n}`} className="border-neutral-200/80">
                <TableCell className="py-2 align-middle text-neutral-700 text-sm">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell className="w-[164px] py-2 text-center align-middle text-neutral-700 text-sm">
                  <Skeleton className="mx-auto h-4 w-28" />
                </TableCell>
                <TableCell className="w-[104px] py-2 text-center align-middle font-medium text-neutral-900 text-sm">
                  <Skeleton className="mx-auto h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatSubmissionDate(value: unknown): string | null {
  if (!value) {
    return null;
  }

  const parsed = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return submissionDateFormatter.format(parsed);
}

function getISOString(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

function formatSubmissionScore(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toFixed(1);
  }

  const numericScore = typeof value === "string" ? Number.parseFloat(value) : null;
  if (numericScore !== null && Number.isFinite(numericScore)) {
    return numericScore.toFixed(1);
  }

  return "—";
}

const submissionDateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short",
});
