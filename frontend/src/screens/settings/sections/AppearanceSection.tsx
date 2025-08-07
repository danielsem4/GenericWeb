import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

export const AppearanceSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Theme</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map(({ value, label, icon: Icon }) => (
            <div
              key={value}
              onClick={() => setTheme(value)}
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                theme === value
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Choose your preferred theme or sync with your system setting
        </p>
      </div>
    </div>
  );
};
