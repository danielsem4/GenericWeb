"use client";

import type * as React from "react";
import { Bot, LogOut, Settings2, SquareTerminal } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import NavMain from "./NavMain";
import { useUser, useUserActions } from "@/common/store/UserStore";

const data = {
  navMain: [
    {
      title: "Dashboards",
      url: "dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Patients",
          url: "",
        },
        {
          title: "Modules",
          url: "",
        },
        {
          title: "Graphs",
          url: "",
        },
      ],
    },
    {
      title: "Modules",
      url: "modules",
      icon: Bot,
      items: [
        {
          title: "All Modules",
          url: "all-modules",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "settings",
        },
        {
          title: "Clinic Settings",
          url: "clinic-settings",
        },
        {
          title: "Support",
          url: "support",
        },
      ],
    },
  ],
};

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const user = useUser();
  const { logout } = useUserActions();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {state === "expanded" && (
            <div className="text-shadow-md font-semibold">
              Welcome, {user?.name || "User"}
            </div>
          )}
          <SidebarTrigger className="p-2" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 w-full">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-sm font-medium hover:bg-red-100 hover:text-red-600",
              state === "collapsed" && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {state === "expanded" && <span>Logout</span>}
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
