import React, { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const LanguageSection: React.FC = () => {
  const { language, setLanguage } = useSettings();

  const languages = [
    { value: "en", label: "English", dir: "ltr" },
    { value: "he", label: "עברית", dir: "rtl" },
    { value: "ru", label: "Русский", dir: "ltr" },
    { value: "ar", label: "العربية", dir: "rtl" },
  ];

  useEffect(() => {
    const selected = languages.find((l) => l.value === language);
    document.documentElement.dir = selected?.dir || "ltr";
  }, [language]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Interface Language</h4>
        <Select value={language} onValueChange={setLanguage}>
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          Changes will take effect immediately
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Regional Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value="dd/mm/yyyy" onValueChange={() => {}}>
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Format</Label>
            <Select value="24" onValueChange={() => {}}>
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
