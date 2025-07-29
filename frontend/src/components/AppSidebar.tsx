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
import { useUser, useUserActions } from "@/common/store/UserStore";
import sidebarData from "@/common/data/sidebarData";
import { useEffect, useState } from "react";


function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const user = useUser();
  const { logout } = useUserActions();
  

  const [sidebarItems, setSidebarItems] = useState(sidebarData.navMain);

  useEffect(() => {
    console.log(user);
    
    if (!user?.user) return;

    const updatedNavMain = sidebarData.navMain.map((navItem) => {
      if (navItem.title === "Modules") {
        return {
          ...navItem,
          items: [
            ...(navItem.items || []),
            ...(user.user.modules?.map((module) => ({
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
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {state === "expanded" && (
            <div className="text-shadow-md font-semibold">
              Welcome, {user?.user?.firstName || "User"}
            </div>
          )}
          <SidebarTrigger className="p-2" />
        </div>
      </SidebarHeader>

      <SidebarContent>

        <NavMain items={sidebarData.navMain} />
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
