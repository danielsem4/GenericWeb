// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Login from "./screens/login/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./screens/settings/Settings";
import Users from "./screens/users/Users";

import Medications from "./screens/modules/medications/Medications";
import PatientDashboard from "./screens/patients/PatientDashboard";
// import ModulesPage from "./screens/modules/Modules";

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
          { path: "patients", element: <Users /> },
          { path: "modules/medications", element: <Medications /> },
          {
            path: "patients/:patientId/dashboard",
            element: <PatientDashboard />,
          },
        ],
      },
    ],
  },
]);

export default router;
