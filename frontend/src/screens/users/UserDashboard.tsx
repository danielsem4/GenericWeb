import React, { useState } from "react";
import type { IModule } from "@/common/types/User";
import type { IUser1 } from "@/common/types/Users";
import { useModules } from "./hooks/useUserModules";
import { UserInfoCard } from "./components/UserInfoCard";
import { ModuleCard } from "./components/ModuleCard";

// mock data
const mockModules: IModule[] = [
  { id: 1, name: "Chat" },
  { id: 2, name: "Analytics" },
  { id: 3, name: "File Mgmt" },
];

const mockUser: IUser1 = {
  email: "jane.doe@example.com",
  first_name: "Jane",
  last_name: "Doe",
  phone_number: "+1-555-000",
  is_clinic_manager: true,
  is_doctor: false,
  is_patient: false,
  is_research_patient: true,
};

export default function UserDashboard() {
  const { assigned, available, add, remove } = useModules(mockModules);
  const [confirmRem, setConfirmRem] = useState<IModule | null>(null);

  return (
    <div className="space-y-6 p-6">
      <UserInfoCard user={mockUser} />

      <section>
        <h2 className="text-xl font-semibold">Assigned Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assigned.length > 0 ? (
            assigned.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                onRemove={() => setConfirmRem(m)}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No modules assigned.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Available Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map((m) => (
            <ModuleCard key={m.id} module={m} onAdd={add} />
          ))}
        </div>
      </section>

      {confirmRem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg space-y-4">
            <p>
              Remove <strong>{confirmRem.name}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmRem(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  remove(confirmRem);
                  setConfirmRem(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
