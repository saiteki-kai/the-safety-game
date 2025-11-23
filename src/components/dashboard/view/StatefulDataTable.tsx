import { DataTable } from "@components/ui/data-table";

import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@components/ui/empty";
import { Skeleton } from "@components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatefulDataTableProps<TData, TValue> {
  data: TData[] | null | undefined;
  isLoading: boolean;
  columns: ColumnDef<TData, TValue>[];
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function StatefulDataTable<TData, TValue>({
  data = [],
  isLoading,
  columns,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: StatefulDataTableProps<TData, TValue>) {
  if (isLoading) {
    const skeletonColumns = columns.map((column, index) => {
      return {
        id: resolveColumnId(column, index),
      };
    });

    return (
      <div className="w-full">
        <TableSkeleton columns={skeletonColumns} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full">
        <DataTableEmptyState
          icon={emptyIcon}
          title={emptyTitle ?? "No results"}
          description={emptyDescription ?? "There is no data to show."}
        />
      </div>
    );
  }

  return <DataTable columns={columns} data={data} />;
}

type TableSkeletonProps = {
  columns: SkeletonColumn[];
};

type SkeletonColumn = {
  id: string;
  align?: "left" | "center" | "right";
};

function TableSkeleton({ columns }: TableSkeletonProps) {
  const DEFAULT_SKELETON_ROWS = 4;
  const rows = Array.from({ length: DEFAULT_SKELETON_ROWS }, (_, index) => `skeleton-row-${index}`);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="min-w-full">
        <TableHeader className="bg-neutral-50">
          <TableRow className="overflow-visible">
            {columns.map((column, index) => (
              <TableHead
                key={column.id}
                className={cn(
                  "px-2 py-2 text-neutral-400 text-xs uppercase tracking-[0.08em]",
                  index === 0 ? "pl-4" : "",
                  column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : undefined,
                )}
              >
                <Skeleton className="h-4 w-24 bg-neutral-200" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((rowKey) => (
            <TableRow key={rowKey} className="border-neutral-100 border-t">
              {columns.map((column, index) => (
                <TableCell
                  key={`${rowKey}-${column.id}`}
                  className={cn(
                    "px-2 py-2 align-middle",
                    index === 0 ? "pl-4" : "",
                    column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : undefined,
                  )}
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="border-neutral-100 border-t px-4 py-3">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

type DataTableEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function DataTableEmptyState({ icon, title, description }: DataTableEmptyStateProps) {
  return (
    <Empty className="flex h-full min-h-[200px] flex-col items-center justify-center border border-neutral-200 border-dashed bg-neutral-50/60 text-center">
      <EmptyContent>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

function resolveColumnId<TData>(column: ColumnDef<TData, unknown>, index: number): string {
  if (column.id) {
    return String(column.id);
  }
  if ("accessorKey" in column && column.accessorKey) {
    return String(column.accessorKey);
  }
  return `column-${index}`;
}
