import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router";

/**
 *
 */

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <nav className="flex items-center justify-center bg-gray-100 px-4 py-3 shadow-sm ">
      <span className="text-xl font-bold text-black" onClick={handleLogoClick}>
        Psychiatric
      </span>
    </nav>
  );
};

export default Navbar;
