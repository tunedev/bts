import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../auth/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
