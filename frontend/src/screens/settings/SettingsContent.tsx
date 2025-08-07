import React from "react";
import { AppearanceSection } from "./sections/AppearanceSection";
import { LanguageSection } from "./sections/LanguageSection";
import { Save } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { ProfileSection } from "./sections/ProfileSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SettingsContentProps {
  activeTab: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  activeTab,
}) => {
  const { isSaving, handleSave } = useSettings();

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "appearance":
        return <AppearanceSection />;
      case "language":
        return <LanguageSection />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "profile":
        return "Profile";
      case "appearance":
        return "Appearance";
      case "language":
        return "Language";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTabTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderTabContent()}
        <Separator />
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
