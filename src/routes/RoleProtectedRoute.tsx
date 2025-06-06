import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface RoleProtectedRouteProps {
  allowedRoles: number[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const raw = localStorage.getItem("inSys");
  let role: number | null = null;

  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") {
      role = parsed.role ?? null;
    }
  } catch (e) {
    console.error("Failed to parse localStorage item 'inSys'", e);
  }

  if (!role) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleProtectedRoute;
