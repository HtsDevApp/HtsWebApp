import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  // 1. Not logged in -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but NOT Admin -> KICK OUT to User Home
  if (user.role !== 'ADMIN') {
    return <Navigate to="/user-home" replace />;
  }

  // 3. Is Admin -> Allow access
  return <>{children}</>;
}