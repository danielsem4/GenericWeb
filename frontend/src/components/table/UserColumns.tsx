// Example usage of PaginatedTable component with Users data

import type { IUser } from "@/common/types/Users";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

// Define columns for the users table
export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ getValue }) => (
      <div className="hidden lg:table-cell">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ getValue }) => (
      <div className="hidden xl:table-cell">
        {new Date(getValue() as string).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ getValue }) => (
      <div className="hidden xl:table-cell">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "Active":
            return "default";
          case "Inactive":
            return "secondary";
          case "Pending":
            return "outline";
          default:
            return "outline";
        }
      };
      return <Badge variant={getStatusVariant(status) as any}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Action clicked for user:", user.id);
          }}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];

/* 
Usage example in Users.tsx:

import { PaginatedTable } from '../../components/table/PaginationTable';
import { userColumns } from '../../components/table/UserColumns';
import { mockUsers } from '../../MocData';

// In your component:
<PaginatedTable 
  data={mockUsers} 
  columns={userColumns}
  onPageChange={(page, pageSize) => {
    console.log('Page changed:', page, 'Page size:', pageSize);
  }}
/>
*/