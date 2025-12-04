import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { DataTablePagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ColumnMeta {
  size?: number; // pixel size for TanStack column sizing
  minSize?: number;
  maxSize?: number;
  align?: "left" | "center" | "right";
  skeletonWidth?: string; // width class specifically for skeletons
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableWrapperClassName?: string;
  firstColumnPadding?: string;
  // optional controlled pagination
  pagination?: PaginationState;
  onPaginationChange?: (updater: PaginationState) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableWrapperClassName,
  firstColumnPadding = "pl-4",
  pagination: paginationProp,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const controlledPagination = paginationProp ?? pagination;
  const handlePaginationChange = onPaginationChange ?? setPagination;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination: controlledPagination,
    },
    defaultColumn: {
      size: 40,
      minSize: 10,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div className="w-full">
      <div className={cn("overflow-hidden rounded-t-md border border-border", tableWrapperClassName)}>
        <Table className="min-w-full">
          <TableHeader className="bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="overflow-visible">
                {headerGroup.headers.map((header, index) => {
                  const size = header.column.columnDef.size;
                  const hasFixedSize = size !== undefined && size !== 150; // 150 is TanStack default
                  return (
                    <TableHead
                      key={header.id}
                      style={
                        hasFixedSize ? { width: `${size}px`, minWidth: `${size}px`, maxWidth: `${size}px` } : undefined
                      }
                      className={cn(
                        "px-3 py-3 text-[11px] text-neutral-500 uppercase tracking-[0.06em]",
                        index === 0 ? firstColumnPadding : "",
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-neutral-100 border-t"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const cellMeta = cell.column.columnDef.meta as ColumnMeta | undefined;
                    const size = cell.column.columnDef.size;
                    const hasFixedSize = size !== undefined && size !== 150; // 150 is TanStack default
                    return (
                      <TableCell
                        key={cell.id}
                        style={
                          hasFixedSize
                            ? { width: `${size}px`, minWidth: `${size}px`, maxWidth: `${size}px` }
                            : undefined
                        }
                        className={cn(
                          "px-3 py-3 align-middle",
                          index === 0 ? firstColumnPadding : "",
                          // Per-column text alignment
                          cellMeta?.align === "center"
                            ? "text-center"
                            : cellMeta?.align === "right"
                              ? "text-right"
                              : undefined,
                          // Allow text wrap for columns without fixed size
                          !hasFixedSize && "whitespace-normal",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
