import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const ProfileSection: React.FC = () => {
  const { profile, setProfile } = useSettings();

  const handleProfileUpdate = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleProfileUpdate("name", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileUpdate("email", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>
    </div>
  );
};
