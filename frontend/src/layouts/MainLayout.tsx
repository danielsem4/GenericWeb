import { Outlet } from "react-router";
import Navbar from "../components/NavBar";

function MainLayout() {
  return (
    <div>
      {/* <Navbar /> */}
      <Outlet />
    </div>
  );
}

export default MainLayout;
