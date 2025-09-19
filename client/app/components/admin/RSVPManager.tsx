import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext"; // Adjust import path
import { apiClient } from "utils/api";

// Define types for your data
interface RSVP {
  id: string;
  guest_name: string;
  number_of_guests: number;
  status: string;
  category_id: string;
}
interface Category {
  id: string;
  name: string;
}

export default function RSVPManager() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    // Fetch RSVPs and Categories
    const fetchData = async () => {
      // Fetch RSVPs
      const rsvpRes = await apiClient(`/api/admin/rsvps?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rsvpData = await rsvpRes.json();
      setRsvps(rsvpData || []);

      // Fetch Categories for the dropdown
      const catRes = await apiClient("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catData = await catRes.json();
      setCategories(catData || []);
    };
    fetchData();
  }, [filter, token]);

  const handleApprove = async (rsvpId: string, categoryId: string) => {
    await apiClient("/api/admin/rsvps/approve", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rsvpId, action: "APPROVE", categoryId }),
    });
    // Refresh list
    setFilter((f) => (f === "PENDING" ? "PENDING_" : "PENDING"));
  };

  const handleReject = async (rsvpId: string) => {
    // Similar fetch call with action: 'REJECT'
  };

  return (
    <div className="admin-card">
      <h2>RSVP Management</h2>
      <div className="filters">
        <button
          onClick={() => setFilter("PENDING")}
          className={filter === "PENDING" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("APPROVED")}
          className={filter === "APPROVED" ? "active" : ""}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("REJECTED")}
          className={filter === "REJECTED" ? "active" : ""}
        >
          Rejected
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((rsvp) => (
            <tr key={rsvp.id}>
              <td>{rsvp.guest_name}</td>
              <td>{rsvp.number_of_guests}</td>
              <td>
                <span className={`status ${rsvp.status.toLowerCase()}`}>
                  {rsvp.status}
                </span>
              </td>
              <td>
                {rsvp.status === "PENDING" && (
                  <div className="action-group">
                    {!rsvp.category_id && (
                      <select
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Assign Category...
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() =>
                        handleApprove(
                          rsvp.id,
                          rsvp.category_id || selectedCategory,
                        )
                      }
                      className="approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(rsvp.id)}
                      className="reject"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
