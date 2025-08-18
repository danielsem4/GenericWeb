import type * as React from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import NavMain from "./NavMain";
import {
  doctorSidebarData,
  clinicManagerSidebarData,
  adminSidebarData,
} from "@/common/data/sidebarData";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useUserStore } from "@/common/store/UserStore";
import { NavProjects } from "./SIdeBarSimpleItem";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { actions } = useUserStore();
  const user = useIsAuthenticated();
  const [sidebarItems, setSidebarItems] = useState(doctorSidebarData);

  useEffect(() => {
    if (!user) return;

    const role = user.role?.toUpperCase?.();

    const base =
      role === "DOCTOR"
        ? doctorSidebarData
        : role === "CLINIC_MANAGER"
        ? clinicManagerSidebarData
        : adminSidebarData;

    const userModuleItems =
      user.modules?.map((m) => ({
        title: m.name,
        url: `/modules/${m.name}`,
      })) ?? [];

    const navMain = base.navMain.map((navItem) => {
      if (navItem.title !== "Modules") return navItem;
      const merged = [...(navItem.items ?? []), ...userModuleItems];

      // de-dupe by title
      const seen = new Set<string>();
      const deduped = merged.filter((i) =>
        seen.has(i.title) ? false : (seen.add(i.title), true)
      );

      return { ...navItem, items: deduped };
    });

    setSidebarItems({ ...base, navMain });
  }, [user?.role, user?.modules]);

  const handleLogout = () => {
    actions.logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="p-4">Loading sidebar...</div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {state === "expanded" && (
            <div className="text-shadow-md font-semibold">
              Welcome, {user?.firstName || "User"}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavProjects items={sidebarItems.navRoutes} />
        <NavMain items={sidebarItems.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-2 w-full">
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
