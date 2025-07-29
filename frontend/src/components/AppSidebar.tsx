import type * as React from "react";
import { LogOut } from "lucide-react";
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
import sidebarData from "@/common/data/sidebarData";
import { useEffect, useState } from "react";
import { useUserStore } from "@/common/store/UserStore";


function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { actions, user } = useUserStore();

  const [sidebarItems, setSidebarItems] = useState(sidebarData.navMain);

  useEffect(() => {
    if (!user) return;

    const updatedNavMain = sidebarData.navMain.map((navItem) => {
      if (navItem.title === "Modules") {
        return {
          ...navItem,
          items: [
            ...(navItem.items || []),
            ...(user.modules?.map((module) => ({
              title: module.name,
              url: `modules/${module.id}`,
            })) || []),
          ],
        };
      }
      return navItem;
    });

    setSidebarItems(updatedNavMain);
  }, [user]);

  const handleLogout = () => {
    actions.logout();
    navigate("/login");
  };
  console.log("AppSidebar user:", user);
  
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
          <SidebarTrigger className="p-2" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarItems} />
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
