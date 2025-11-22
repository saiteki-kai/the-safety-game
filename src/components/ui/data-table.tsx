import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnSizingState,
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableWrapperClassName,
  firstColumnPadding = "pl-4",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className={cn("overflow-hidden rounded-md border", tableWrapperClassName)}>
        <Table className="min-w-full">
          <TableHeader className="bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="overflow-visible">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={cn(
                        "px-2 py-2 text-[11px] text-neutral-500 uppercase tracking-[0.06em]",
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
                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={cn(
                          "px-2 py-2 align-middle",
                          index === 0 ? firstColumnPadding : "",
                          // Per-column text alignment
                          cellMeta?.align === "center" ? "text-center" : cellMeta?.align === "right" ? "text-right" : undefined,
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
