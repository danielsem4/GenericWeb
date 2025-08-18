import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AccessorFn<T> = (row: T, rowIndex: number) => React.ReactNode;

export type ColumnDef<T> = {
  header: React.ReactNode;
  accessor?: keyof T | AccessorFn<T>;
  cell?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  onRowClick?: (row: T, index: number) => void;
  renderActions?: (row: T, index: number) => React.ReactNode;
  getRowId?: (row: T, index: number) => React.Key;
  className?: string;
};

function getSafeOptions(options?: number[]) {
  return options && options.length ? options : [5, 10, 15, 20];
}

function getDefaultPageSize(options: number[], initial?: number) {
  const candidate = initial ?? options[0];
  return options.includes(candidate) ? candidate : options[0];
}

export function DataTable<T>({
  data,
  columns,
  pageSizeOptions = [5, 10, 15, 20],
  initialPageSize,
  onRowClick,
  renderActions,
  getRowId,
  className,
}: DataTableProps<T>) {
  const safeOptions = getSafeOptions(pageSizeOptions);

  const [pageSize, setPageSize] = useState<number>(() =>
    getDefaultPageSize(safeOptions, initialPageSize)
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!safeOptions.includes(pageSize)) {
      setPageSize(getDefaultPageSize(safeOptions, initialPageSize));
      setCurrentPage(1);
    }
  }, [safeOptions.join(","), initialPageSize, pageSize]);

  const totalItems = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageData = data.slice(startIndex, endIndex);

  const goto = (page: number) =>
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  const setSize = (size: number) => {
    setPageSize(size);
    goto(1);
  };

  return (
    <div className={cn("w-full rounded-md border p-4", className)}>
      <Table>
        <TableHeader>
          <TableRow className="text-base">
            {columns.map((col, i) => (
              <TableHead
                key={`h-${i}`}
                className={cn(
                  col.headerClassName,
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
              >
                {col.header}
              </TableHead>
            ))}
            {renderActions && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((row, rowIndex) => {
            const globalIndex = startIndex + rowIndex;
            const key = getRowId?.(row, globalIndex) ?? globalIndex;
            return (
              <TableRow
                key={key}
                className={cn(
                  onRowClick &&
                    "cursor-pointer hover:bg-muted/50 transition-colors border-b border-gray-200"
                )}
                onClick={() => onRowClick?.(row, globalIndex)}
              >
                {columns.map((col, ci) => {
                  const rawValue =
                    typeof col.accessor === "function"
                      ? (col.accessor as AccessorFn<T>)(row, globalIndex)
                      : col.accessor
                      ? (row as any)[col.accessor]
                      : undefined;
                  const content = col.cell
                    ? col.cell(rawValue, row, globalIndex)
                    : rawValue;
                  return (
                    <TableCell
                      key={`c-${globalIndex}-${ci}`}
                      className={cn(
                        "text-base",
                        col.className,
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {content}
                    </TableCell>
                  );
                })}
                {renderActions && (
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {renderActions(row, globalIndex)}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">{totalItems ? startIndex + 1 : 0}</span>
          –<span className="font-medium">{endIndex}</span> of{" "}
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={pageSize}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {safeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(1)}
              disabled={currentPage === 1}
            >
              « First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </Button>
            <span className="min-w-[90px] text-center text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
