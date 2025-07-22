import { Navigate } from "react-router";
import { useIsAuthenticated } from "../common/store/UserStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    // If user is already authenticated, redirect to home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
