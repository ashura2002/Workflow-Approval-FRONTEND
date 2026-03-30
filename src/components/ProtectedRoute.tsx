import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  element: ReactElement;
  roles?: string | string[];
  fallbackPath?: string;
};

export const ProtectedRoute = ({
  element,
  roles,
  fallbackPath = "/",
}: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (roles && !auth.hasRole(roles)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return element;
};
