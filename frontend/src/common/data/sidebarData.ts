import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Settings2,
  SquareTerminal,
  Home,
  Users,
  Stethoscope,
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

export const doctorSidebarData: SidebarData = {
  navRoutes: [
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
    {
      name: "Patients",
      url: "/patients",
      icon: Users,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Modules", url: "/modules" },
        { title: "Graphs", url: "/graphs" },
      ],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: Bot,
      items: [],
    },
  ],
};

export const clinicManagerSidebarData: SidebarData = {
  navRoutes: [
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
    {
      name: "Doctors",
      url: "/doctors",
      icon: Stethoscope,
    },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Patients", url: "/users" },
        { title: "Modules", url: "/modules" },
        { title: "Graphs", url: "/graphs" },
      ],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: Bot,
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

export const adminSidebarData: SidebarData = {
  navRoutes: [
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
    {
      name: "Users",
      url: "/users",
      icon: Users,
    },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Patients", url: "/users" },
        { title: "Modules", url: "/modules" },
        { title: "Graphs", url: "/graphs" },
      ],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: Bot,
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
