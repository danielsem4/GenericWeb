import InfoCard from "@/components/InfoCard";
import { Users, CalendarCheck, Building2, Package } from "lucide-react";
import { UserTable } from "@/components/UserTable";
import { useNavigate } from "react-router";
import { useUserStore } from "@/common/store/UserStore";
import { useUsers } from "../users/hooks/useGetUsers";

function Home() {
  const navigate = useNavigate();
  const { user: authUser } = useUserStore();
  if (!authUser) {
    return (
      <div className="space-y-4 w-full">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="text-sm text-muted-foreground">Loading user…</div>
      </div>
    );
  }
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error,
  } = useUsers(authUser.clinicId.toString(), authUser.id.toString());

  const cards = [
    { title: "Patients", icon: Users, value: "120" },
    { title: "Clinics", icon: Building2, value: "12" },
    { title: "Modules", icon: Package, value: "5" },
    { title: "Appointments", icon: CalendarCheck, value: "328" },
  ];

  const handleSeeAllUsers = () => {
    console.log("Redirect to full Users page...");
    navigate("/users");
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <InfoCard
            key={card.title}
            title={card.title}
            Icon={card.icon}
            value={card.value}
          />
        ))}
      </div>

      {!isLoadingUsers && isErrorUsers && (
        <div className="mb-3 text-sm text-red-600">
          Failed to load users{error?.message ? `: ${error.message}` : ""}.
        </div>
      )}

      {isLoadingUsers ? (
        <div className="text-sm text-muted-foreground">Loading users…</div>
      ) : (
        <UserTable
          data={users}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={(row) => navigate(`/user/${row.id}`)}
        />
      )}
    </div>
  );
}

export default Home;
