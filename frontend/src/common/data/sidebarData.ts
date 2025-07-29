import { Bot, Settings2, SquareTerminal } from "lucide-react";


const sidebarData = {
    navMain: [
      {
        title: "Dashboards",
        url: "dashboards",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Patients",
            url: "users",
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

  export default sidebarData;