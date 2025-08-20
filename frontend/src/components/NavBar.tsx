import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/common/store/UserStore";

const Navbar: React.FC = () => {
  const { user: authUser } = useUserStore();

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <header className="border-b bg-background">
      <nav className="flex h-14 items-center px-4 sm:px-6">
        <div className="flex flex-1 items-center">
          <SidebarTrigger className="p-2" aria-label="Open sidebar" />
        </div>

        <div className="flex flex-1 justify-center">
          <span
            onClick={handleLogoClick}
            className="cursor-pointer select-none text-2xl font-bold text-foreground hover:text-primary"
          >
            {authUser?.clinicName ?? "Generic Hit"}
          </span>
        </div>

        <div className="flex flex-1 justify-end" />
      </nav>
    </header>
  );
};

export default Navbar;
