import { Outlet } from "react-router";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/sidebar/AppSidebar";

/**
 * MainLayout component that wraps the application layout with a sidebar, navbar, and footer.
 * It uses the SidebarProvider to manage sidebar state and provides a consistent layout structure.
 */

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <div className="flex flex-col min-h-screen w-full">
          <Navbar />
          <main className="flex flex-1 p-4 ">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
