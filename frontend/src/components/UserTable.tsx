import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationControls from "@/components/PaginationControls";
import type { IUser } from "@/common/types/Users";
import { useCallback, useState } from "react";

interface UserTableProps {
  data: IUser[];
  pageSizeOptions?: number[];
}

export function UserTable({
  data,
  pageSizeOptions = [5, 10, 15, 20],
}: UserTableProps) {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex)
  ;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="w-full rounded-md border p-4">
      <Table>
        <TableHeader>
          <TableRow className="text-base">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-gray-200"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <TableCell className="font-semibold text-base">{user.name}</TableCell>
              <TableCell className="text-base">{user.email}</TableCell>
              <TableCell className="text-base">{user.role}</TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusColor(user.status)} text-xs font-medium px-2 py-1 rounded-full`}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-base">{user.department}</TableCell>
              <TableCell className="text-base">
                {new Date(user.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-base">
                {new Date(user.lastLogin).toLocaleString()}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Clean JSX now */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onFirstPage={handleFirstPage}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onLastPage={handleLastPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}

export default UserTable;
