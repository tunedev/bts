import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext"; // Adjust import path
import { apiClient } from "../../../utils/api";

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
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    if (!token) {
      return;
    }
    setIsLoading(true);

    try {
      const rsvpRes = await apiClient(`/api/admin/rsvps?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(rsvpRes.data || []);
      if (categories.length === 0) {
        const catRes = await apiClient("/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(catRes.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, filter, categories.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (rsvpId: string, categoryId: string) => {
    await apiClient("/api/admin/rsvps/approve", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rsvpId, action: "APPROVE", categoryId }),
    });
    setFilter((f) => (f === "PENDING" ? "PENDING_" : "PENDING"));
  };

  const handleReject = async (rsvpId: string) => {
    try {
      await apiClient("/api/admin/rsvps/approve", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rsvpId, action: "REJECT" }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to reject RSVP:", error);
    }
  };

  return (
    <div className="admin-card">
      <h2>RSVP Management</h2>
      <div className="header-btns">
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
        <button
          onClick={fetchData}
          className="refresh-button"
          disabled={isLoading}
        >
          &#x21bb; {/* This is a circular arrow character */}
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
          {rsvps
            .filter((d) => d.status === filter)
            .map((rsvp) => (
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
