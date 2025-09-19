import { Outlet } from "react-router";
import { AuthProvider } from "../auth/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
