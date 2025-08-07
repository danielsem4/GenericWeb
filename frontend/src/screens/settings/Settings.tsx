import React, { useState } from "react";
import { Settings } from "lucide-react";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsContent } from "./SettingsContent";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    // <div className="min-h-screen bg-background p-4">
    //   <div className="max-w-6xl mx-auto">
    //     <div className="mb-8">
    //       <div className="flex items-center space-x-3 mb-2">
    //         <Settings className="w-8 h-8 text-foreground" />
    //         <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    //       </div>
    //       <p className="text-muted-foreground">
    //         Manage your account settings and preferences
    //       </p>
    //     </div>

    //     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    //       <div className="lg:col-span-1">
    //         <SettingsSidebar
    //           activeTab={activeTab}
    //           setActiveTab={setActiveTab}
    //         />
    //       </div>
    //       <div className="lg:col-span-3">
    //         <SettingsContent activeTab={activeTab} />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>Settings</div>
  );
};

export default SettingsPage;
