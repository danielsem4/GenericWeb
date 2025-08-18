import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DataTable, type ColumnDef } from "./table/DataTable";
import type { IUser } from "@/common/types/Users";

function getRoleClasses(role: string) {
  const r = role?.toUpperCase();
  if (r === "RESEARCH_PATIENT") return "bg-purple-100 text-purple-800";
  return "bg-gray-100 text-gray-800";
}

type Props = {
  data: IUser[];
  pageSizeOptions?: number[];
  onRowClick?: (row: IUser, index: number) => void;
};

export function UserTable({ data, pageSizeOptions, onRowClick }: Props) {
  const columns: ColumnDef<IUser>[] = [
    {
      header: "Name",
      accessor: (u) => `${u.first_name} ${u.last_name}`,
      className: "font-semibold",
    },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone_number" },
    {
      header: "Role",
      accessor: "role",
      cell: (val: string) => (
        <Badge
          className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleClasses(
            val
          )}`}
        >
          {val}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable<IUser>
      data={data}
      columns={columns}
      pageSizeOptions={pageSizeOptions}
      initialPageSize={pageSizeOptions?.[0]}
      onRowClick={onRowClick}
      renderActions={(row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            console.log("menu for", (row as IUser).id ?? (row as IUser).email);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
      getRowId={(row) => row.id}
    />
  );
}
