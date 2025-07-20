import { createBrowserRouter } from "react-router";
import Login from "./screens/login/Login";
import MainLayout from "./layouts/MainLayout";
import Navbar from "./components/NavBar";
import Home from "./screens/home/components/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

export default router;
