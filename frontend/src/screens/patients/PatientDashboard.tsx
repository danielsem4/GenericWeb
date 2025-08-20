import { useUserStore } from "@/common/store/UserStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "./hooks/useGetUser";
import {
  CircleUser,
  Mail,
  Phone,
  BadgeInfo,
  IdCard,
  Boxes,
  UserSquare2,
} from "lucide-react";
import FieldCard from "@/components/FieldCard";
import { useParams } from "react-router";
import ModuleCard from "@/components/ModuleCard";
import { getModuleIconByName } from "@/common/util/utils";

/**
 *
 * @returns
 */

function PatientDashboard() {
  const authUser = useUserStore((state) => state.user);
  const { patientId } = useParams();

  if (!patientId) {
    return <p className="p-4">You must be logged in to view this page.</p>;
  }

  const {
    data: selectedUser,
    isLoading,
    error,
  } = useUser(authUser!!.clinicId.toString(), patientId);

  if (isLoading) {
    return <p className="p-4">Loading patient data...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Failed to load patient data</p>;
  }

  if (!selectedUser) return <p className="p-4">No user found.</p>;

  const activeModules = selectedUser.patient_modules!!.filter(
    (module) => module.active
  );
  const inactiveModules = selectedUser.patient_modules!!.filter(
    (module) => !module.active
  );

  const fields = [
    {
      title: "Email",
      description: selectedUser.email,
      icon: Mail,
    },
    {
      title: "First Name",
      description: selectedUser.first_name,
      icon: UserSquare2,
    },
    {
      title: "Last Name",
      description: selectedUser.last_name,
      icon: CircleUser,
    },
    {
      title: "Phone",
      description: selectedUser.phone_number,
      icon: Phone,
    },
    {
      title: "Role",
      description: selectedUser.role,
      icon: BadgeInfo,
    },
    {
      title: "ID",
      description: patientId.toString(),
      icon: IdCard,
    },
  ];

  return (
    <div className="flex flex-1 flex-col space-y-6 items-center">
      <Card className="rounded-2xl p-6 max-w-8xl">
        <CardHeader className="flex items-center space-x-2 p-2">
          <CircleUser className="h-10 w-10 text-blue-500" aria-hidden="true" />
          <span className="text-2xl font-semibold">Patient Information</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <FieldCard
                key={field.title}
                icon={field.icon}
                title={field.title}
                description={field.description}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-1 justify-around gap-6">
        <Card className="rounded-2xl p-6 max-w-6xl">
          <CardHeader className="flex items-center space-x-2 p-2">
            <Boxes className="h-10 w-10 text-blue-500" aria-hidden="true" />
            <span className="text-2xl font-semibold">Avaliable modules</span>
          </CardHeader>
          <CardContent>
            <div
              className={`grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-${
                inactiveModules.length === 2 ? inactiveModules.length : 3
              } gap-6`}
            >
              {inactiveModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  icon={getModuleIconByName(module.name)}
                  title={module.name}
                  description={module.description}
                  isActive={module.active}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl p-6 max-w-6xl">
          <CardHeader className="flex items-center space-x-2 p-2">
            <Boxes className="h-10 w-10 text-blue-500" aria-hidden="true" />
            <span className="text-2xl font-semibold">Modules in use</span>
          </CardHeader>
          <CardContent>
            <div
              className={`grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-${
                activeModules.length === 2 ? activeModules.length : 3
              } gap-6`}
            >
              {activeModules.map((module) => {
                console.log("module", module);
                return (
                  <ModuleCard
                    key={module.id}
                    icon={getModuleIconByName(module.name)}
                    title={module.name}
                    description={module.description}
                    isActive={module.active}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PatientDashboard;
