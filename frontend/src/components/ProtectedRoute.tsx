// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../common/store/UserStore";

function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
