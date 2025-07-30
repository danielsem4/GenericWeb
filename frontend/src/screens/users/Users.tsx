import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginatedTable } from "@/components/table/PainationTable";
import { sampleUsers } from "@/common/data/mocData";
import type { IUser } from "@/common/types/Users";
import { useUserStore } from "@/common/store/UserStore";
import { useGetUsers } from "./hooks/useGetUsers";

function UsersPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // const { actions, user } = useUserStore();
  // const users = useGetUsers(user!!.clinicId.toString(), user!!.id.toString());

  const filteredUsers = sampleUsers.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );


  const getStatusBadge = (status: IUser["status"]) => {
    const variant =
      status === "Active"
        ? "secondary"
        : status === "Inactive"
        ? "destructive"
        : "outline";
    return (
      <Badge variant={variant} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <Input
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

<PaginatedTable<IUser>
        title="User List"
        description="Browse and manage your user accounts."
        data={filteredUsers}
        onRowClick={(user) => navigate(`/user/${user.id}`)}
        columns={[
          {
            key: "name",
            header: "Name",
          },
          {
            key: "email",
            header: "Email",
          },
          {
            key: "role",
            header: "Role",
          },
          {
            key: "status",
            header: "Status",
            render: (user) => getStatusBadge(user.status),
          },
          {
            key: "department",
            header: "Department",
          },
          {
            key: "joinDate",
            header: "Join Date",
          },
          {
            key: "lastLogin",
            header: "Last Login",
          },
        ]}
      />
    </div>
  );
}

export default UsersPage;