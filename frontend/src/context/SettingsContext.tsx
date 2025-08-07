// context/SettingsContext.tsx
import type {
  IProfileData,
  ISettingsContextType,
} from "@/common/types/Settings";
import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext<ISettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<IProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [language, setLanguage] = useState<string>("en");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsSaving(false);
    console.log("Saved");
  };

  return (
    <SettingsContext.Provider
      value={{
        profile,
        setProfile,
        language,
        setLanguage,
        isSaving,
        handleSave,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): ISettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
