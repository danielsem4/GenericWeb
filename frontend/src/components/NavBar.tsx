import { ThemeToggle } from "./ThemeToggle";
import { useUserFullName, useClinicName, useUserActions } from "../common/store/UserStore";

const Navbar: React.FC = () => {
  const userFullName = useUserFullName();
  const clinicName = useClinicName();
  const { clearUser } = useUserActions();

  const handleLogout = () => {
    // Clear user data
    clearUser();
    
    // Clear tokens from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    
    // Redirect to login
    window.location.href = "/";
  };

  return (
    <nav className="bg-background border-b border-border px-4 py-3 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <span className="text-xl font-bold text-foreground">
          {clinicName}
        </span>
        <div className="flex items-center space-x-4 text-sm">
          <a href="#" className="text-foreground hover:text-primary hover:underline">
            Patients
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:underline">
            Medications
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:underline">
            Activities
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:underline">
            User Settings
          </a>
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
