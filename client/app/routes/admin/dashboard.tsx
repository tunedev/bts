import RSVPManager from "../../components/admin/RSVPManager";
import CategoryManager from "../../components/admin/CategoryManager";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Wedding Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <main className="admin-main">
        <RSVPManager />
        <CategoryManager />
      </main>
    </div>
  );
}
