import type { Table } from "@tanstack/react-table";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const rowCount = table.getFilteredRowModel().rows.length || table.getRowModel().rows.length;
  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);
  const pageSizeSelectId = useId();

  return (
    <div className="flex items-center justify-between space-x-2 rounded-b-md border border-border border-t-0 bg-neutral-50 px-4 py-2 text-sm">
      {/* Left: page size select + range text */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor={pageSizeSelectId} className="font-light text-neutral-800 text-sm">
            Dimensione pagina
          </label>
          <Select value={String(pageSize)} onValueChange={(val) => table.setPageSize(Number(val))}>
            <SelectTrigger
              id={pageSizeSelectId}
              size="sm"
              className="h-8 min-w-[56px] px-2 font-light text-neutral-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="font-light text-neutral-800 text-sm">
          {from} - {to} di {rowCount}
        </div>
      </div>

      {/* Right: navigation buttons */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden rounded-full bg-transparent text-neutral-800 hover:bg-neutral-100 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Primo"
            title="Primo"
          >
            <ChevronFirst />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full bg-transparent text-neutral-800 hover:bg-neutral-100"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Precedente"
            title="Precedente"
          >
            <ChevronLeft />
          </Button>
        </div>

        <div className="hidden items-center px-3 font-light text-neutral-800 text-sm sm:flex">
          Pagina {pageIndex + 1} di {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full bg-transparent text-neutral-800 hover:bg-neutral-100"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Successivo"
            title="Successivo"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden rounded-full bg-transparent text-neutral-800 hover:bg-neutral-100 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Ultimo"
            title="Ultimo"
          >
            <ChevronLast />
          </Button>
        </div>
      </div>
    </div>
  );
}
