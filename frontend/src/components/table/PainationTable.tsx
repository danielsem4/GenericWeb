import { useMemo, useEffect } from "react";
import { usePaginationStore } from "@/common/store/PaginationStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatedTableProps<TData> {
  title?: string;
  description?: string;
  viewAllLink?: string;
  data: TData[];
  columns: {
    key: keyof TData;
    header: string;
    render?: (value: TData) => React.ReactNode;
    className?: string;
    hideOn?: "md" | "lg" | "xl";
  }[];
  onRowClick?: (row: TData) => void;
}

export function PaginatedTable<TData>({
  title = "Table",
  description = "",
  viewAllLink,
  data,
  columns,
  onRowClick,
}: PaginatedTableProps<TData>) {
  const { page, pageSize, totalItems, setPage, setPageSize, setTotalItems } =
    usePaginationStore();

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  useEffect(() => {
    setTotalItems(data.length);
  }, [data, setTotalItems]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Card className="shadow-lg border rounded-2xl overflow-hidden p-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b bg-muted/30 p-4">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {viewAllLink && (
          <Button asChild size="sm" variant="secondary" className="mt-2 sm:mt-0">
            <a href={viewAllLink} className="flex items-center gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    className={`font-medium ${col.className ?? ""} ${
                      col.hideOn ? `hidden ${col.hideOn}:table-cell` : ""
                    }`}
                  >
                    {col.header}
                  </TableHead>
                ))}
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={`${col.className ?? ""} ${
                          col.hideOn ? `hidden ${col.hideOn}:table-cell` : ""
                        }`}
                      >
                        {col.render ? col.render(row) : String(row[col.key])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> -{" "}
            <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of{" "}
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded-lg px-3 py-1 text-sm bg-background"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
