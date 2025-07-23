import { createBrowserRouter } from "react-router";
import Login from "./screens/login/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./screens/settings/Settings";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
