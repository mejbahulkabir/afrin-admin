import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";
import { type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
