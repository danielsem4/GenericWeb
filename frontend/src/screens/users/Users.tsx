import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/common/store/UserStore";
import { useUsers } from "./hooks/useGetUsers";
import { UserTable } from "@/components/UserTable";
import type { IUser } from "@/common/types/Users";

function UsersPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="space-y-4 w-full">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="text-sm text-muted-foreground">Loading user…</div>
      </div>
    );
  }

  // Call your hook with safe params
  const usersQuery = useUsers(String(user.clinicId), user.id.toString());

  // Normalize to an array regardless of the server shape
  const allUsers: IUser[] = Array.isArray(usersQuery?.data)
    ? (usersQuery!.data as IUser[])
    : Array.isArray((usersQuery as any)?.data?.results)
    ? ((usersQuery as any).data.results as IUser[])
    : [];

  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = normalizedSearch
    ? allUsers.filter((u) =>
        `${u.first_name} ${u.last_name} ${u.email} ${u.phone_number}`
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : allUsers;

  const handleRowClick = (u: IUser) => navigate(`/patients/${u.id}/dashboard`);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <Input
        placeholder="Search users by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <UserTable
        data={filteredUsers}
        pageSizeOptions={[10, 20, 30]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default UsersPage;
