import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Package,
  Pill,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import InfoCard from "@/components/InfoCard";
import { UserTable } from "@/components/UserTable";
import { Button } from "@/components/ui/button";

import { useUserStore } from "@/common/store/UserStore";
import { useUsers } from "../users/hooks/useGetUsers";
import { useMedications } from "@/screens/modules/medications/hooks/useGetPatientMedications";

type Role = "DOCTOR" | "CLINIC_MANAGER" | "ADMIN" | string;

type CardItem = {
  title: string;
  icon: LucideIcon;
  value: string;
};

function gridCols(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
}

function buildCards(params: {
  role: Role;
  patientsCount: number;
  doctorsCount: number;
  modulesCount: number;
  medicationsCount: number;
  hasModule: (name: string) => boolean;
  questionnairesCount: number;
}): CardItem[] {
  const {
    role,
    patientsCount,
    doctorsCount,
    modulesCount,
    medicationsCount,
    hasModule,
    questionnairesCount,
  } = params;

  const list: CardItem[] = [];

  if (role === "DOCTOR") {
    list.push({ title: "Patients", icon: Users, value: String(patientsCount) });
    list.push({ title: "Modules", icon: Package, value: String(modulesCount) });
    if (hasModule("medications")) {
      list.push({
        title: "Medications",
        icon: Pill,
        value: String(medicationsCount),
      });
    }
    if (
      hasModule("questionnaires") ||
      hasModule("questionnaire") ||
      hasModule("question")
    ) {
      list.push({
        title: "Questionnaires",
        icon: ClipboardList,
        value: String(questionnairesCount),
      });
    }
  } else if (role === "CLINIC_MANAGER") {
    list.push({ title: "Doctors", icon: Users, value: String(doctorsCount) });
    list.push({ title: "Patients", icon: Users, value: String(patientsCount) });
    list.push({ title: "Modules", icon: Package, value: String(modulesCount) });
  } else if (role === "ADMIN") {
    list.push({ title: "Clinics", icon: Building2, value: "-" });
    list.push({ title: "Modules", icon: Package, value: String(modulesCount) });
  } else {
    list.push({ title: "Modules", icon: Package, value: String(modulesCount) });
  }

  return list.slice(0, 5);
}

function Home() {
  const navigate = useNavigate();
  const authUser = useUserStore((state) => state.user);

  if (!authUser) {
    return (
      <div className="space-y-4 w-full">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="text-sm text-muted-foreground">Loading user…</div>
      </div>
    );
  }
  const clinicId = authUser.clinicId ?? 0;
  const userId = authUser.id ?? 0;
  const role: Role = authUser.role;

  const modules = authUser.modules ?? [];
  const modulesCount = modules.length;
  const moduleNameSet = new Set(
    modules.map((m) => (m.name ?? "").toLowerCase())
  );
  const hasModule = (name: string) => moduleNameSet.has(name.toLowerCase());

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error,
  } = useUsers(clinicId.toString(), userId.toString());

  const enableMedications = role === "DOCTOR" && hasModule("medications");

  const { data: medications = [] } = useMedications(
    userId.toString(),
    clinicId.toString(),
    enableMedications
  );

  let doctorsCount = 0;
  let patientsCount = 0;
  for (const u of users as Array<{ role?: string }>) {
    const r = (u.role ?? "").toUpperCase();
    if (r.includes("DOCTOR")) doctorsCount++;
    if (r.includes("PATIENT")) patientsCount++;
  }

  // replace when questionnaire API is available
  const questionnairesCount = 0;

  const cards = buildCards({
    role,
    patientsCount,
    doctorsCount,
    modulesCount,
    medicationsCount: medications.length,
    hasModule,
    questionnairesCount,
  });

  const handleSeeAllUsers = () => {
    navigate("/users");
  };

  const handleCardNavigation = (key: string) => {
    const k = key.toLowerCase();
    const routes: Record<string, string> = {
      patients: "/users",
      doctors: "/users",
      modules: "/modules",
      medications: "/modules/medications",
      // clinics, questionnaires not yet routed
    };
    const path = routes[k];
    if (path) navigate(path);
  };

  console.log(users);

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      {/* KPI Cards */}
      <div className={`grid gap-3 ${gridCols(cards.length)}`}>
        {cards.map((card) => (
          <InfoCard
            key={card.title}
            title={card.title}
            Icon={card.icon}
            value={card.value}
            onClick={() => handleCardNavigation(card.title)}
          />
        ))}
      </div>

      {/* Users area */}
      {!isLoadingUsers && isErrorUsers && (
        <div className="mb-3 text-sm text-red-600">
          Failed to load users{error?.message ? `: ${error.message}` : ""}.
        </div>
      )}

      {isLoadingUsers ? (
        <div className="text-sm text-muted-foreground">Loading users…</div>
      ) : (
        <div className="space-y-4">
          <UserTable
            data={users}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={(row: any) => {
              navigate(`/patients/${Number(row.id)}/dashboard`);
            }}
          />

          <div className="flex justify-end">
            <Button onClick={handleSeeAllUsers} variant="outline">
              See all users
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
