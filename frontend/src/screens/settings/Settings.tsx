import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { theme: resolvedTheme, setTheme } = useTheme();
  const [theme, setLocalTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLocalTheme(resolvedTheme || "light");
  }, [resolvedTheme]);

  const handleThemeChange = (value: string) => {
    setLocalTheme(value);
    setTheme(value);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Profile Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the theme for the dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="flex gap-6"
          >
            <RadioGroupItem value="light" id="light" className="peer hidden" />
            <label
              htmlFor="light"
              className="cursor-pointer peer-checked:ring-2 ring-ring rounded-xl border p-4 w-36 flex flex-col items-center"
            >
              <div className="w-full h-20 bg-white rounded shadow-inner border flex flex-col gap-2 justify-center p-2">
                <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
                <div className="bg-gray-300 h-3 w-full rounded"></div>
              </div>
              <span className="mt-2">Light</span>
            </label>

            <RadioGroupItem value="dark" id="dark" className="peer hidden" />
            <label
              htmlFor="dark"
              className="cursor-pointer peer-checked:ring-2 ring-ring rounded-xl border p-4 w-36 flex flex-col items-center"
            >
              <div className="w-full h-20 bg-zinc-900 rounded shadow-inner border flex flex-col gap-2 justify-center p-2">
                <div className="bg-zinc-700 h-3 w-3/4 rounded"></div>
                <div className="bg-zinc-700 h-3 w-2/3 rounded"></div>
                <div className="bg-zinc-800 h-3 w-full rounded"></div>
              </div>
              <span className="mt-2">Dark</span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select your preferred language.
          </p>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Hebrew</SelectItem>
              <SelectItem value="fr">Russian</SelectItem>
              <SelectItem value="de">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
