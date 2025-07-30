import type { IUser1 } from "@/common/types/Users";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";


export function UserInfoCard({ user }: { user: IUser1 }) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const roles: [boolean, string][] = [
    [user.is_clinic_manager, "Clinic Manager"],
    [user.is_doctor, "Doctor"],
    [user.is_patient, "Patient"],
    [user.is_research_patient, "Research Patient"],
  ];

  return (
    <Card className="p-4 space-y-2">
      <CardHeader>
        <CardTitle>{fullName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        <div className="flex flex-wrap gap-2">
          {roles
            .filter(([flag]) => flag)
            .map(([, label]) => (
              <Badge key={label}>{label}</Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
