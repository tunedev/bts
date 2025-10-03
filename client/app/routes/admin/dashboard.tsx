import React, { useState } from "react";
import RSVPManager from "../../components/admin/RSVPManager";
import CategoryManager from "../../components/admin/CategoryManager";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("rsvps"); // 'rsvps' or 'categories'
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Wedding Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <nav className="admin-tabs">
        <button
          onClick={() => setActiveTab("rsvps")}
          className={activeTab === "rsvps" ? "active" : ""}
        >
          RSVPs
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={activeTab === "categories" ? "active" : ""}
        >
          Categories
        </button>
      </nav>

      <main className="admin-main">
        <div
          className={`tab-content ${activeTab === "rsvps" ? "active-on-mobile" : ""}`}
        >
          <RSVPManager />
        </div>
        <div
          className={`tab-content ${activeTab === "categories" ? "active-on-mobile" : ""}`}
        >
          <CategoryManager />
        </div>
      </main>
    </div>
  );
}
