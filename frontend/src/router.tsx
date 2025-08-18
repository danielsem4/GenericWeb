// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Login from "./screens/login/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./screens/settings/Settings";
import Users from "./screens/users/Users";
import User from "./screens/users/User";
import UserDashboard from "./screens/users/UserDashboard";
import Medications from "./screens/modules/medications/Medications";
import { SettingsProvider } from "./context/SettingsContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <Home /> },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          { path: "users", element: <Users /> },
          { path: "user/:userId", element: <User /> },
          { path: "userDashboard", element: <UserDashboard /> },
          { path: "modules/medications", element: <Medications /> },
        ],
      },
    ],
  },
]);

export default router;
