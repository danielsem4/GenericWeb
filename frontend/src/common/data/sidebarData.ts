import type { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  Stethoscope,
  Settings2,
  SquareTerminal,
  Building2,
  Package,
  BarChart3,
  PlusCircle,
} from "lucide-react";

type NavRoute = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type NavItem = {
  title: string;
  url: string;
};

type NavSection = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: NavItem[];
};

export type SidebarData = {
  navRoutes: NavRoute[];
  navMain: NavSection[];
};


export const adminSidebarData: SidebarData = {
  navRoutes: [
    { name: "Home", url: "/home", icon: Home },
    { name: "Clinics", url: "/clinics", icon: Building2 },
    { name: "Modules", url: "/modules", icon: Package },
    { name: "Settings", url: "/settings", icon: Settings2 },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [{ title: "Statistics", url: "/dashboards/statistics" }],
    },
    {
      title: "Manage",
      url: "/manage",
      icon: PlusCircle,
      items: [
        { title: "Create Clinic", url: "/manage/create-clinic" },
        { title: "Create Module", url: "/manage/create-module" },
        { title: "Create Dashboard", url: "/manage/create-dashboard" },
      ],
    },
  ],
};


export const clinicManagerSidebarData: SidebarData = {
  navRoutes: [
    { name: "Home", url: "/home", icon: Home },
    { name: "Doctors", url: "/users", icon: Stethoscope },
    { name: "Clinic Modules", url: "/modules", icon: Package },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Statistics", url: "/dashboards/statistics" },
        { title: "Clinic managers", url: "/dashboards/clinic-managers" },
      ],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: Package,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings" },
        { title: "Clinic Settings", url: "/clinic-settings" },
        { title: "Support", url: "/support" },
      ],
    },
  ],
};


export const doctorSidebarData: SidebarData = {
  navRoutes: [
    { name: "Home", url: "/home", icon: Home },
    { name: "Patients", url: "/users", icon: Users },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [{ title: "Statistics", url: "/dashboards/statistics" }],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: Package,
      items: [],
    },
  ],
};