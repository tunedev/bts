import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

// Define a type for a category
interface Category {
  id: string;
  name: string;
  side: string;
  max_guests: number;
  invitation_token: string | null;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    side: "BRIDE",
    max_guests: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  // Fetch existing categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8091/api/admin/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(
        `${window.location.origin}/rsvp?token=${text}`,
      );
      alert("Invitation link copied to clipboard!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:8091/api/admin/categories",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newCategory,
            max_guests: parseInt(String(newCategory.max_guests), 10), // Ensure it's a number
          }),
        },
      );
      const createdCategory = await response.json();
      if (!response.ok)
        throw new Error(createdCategory.error || "Failed to create category.");

      setCategories((prev) => [...prev, createdCategory]);
      // Reset form
      setNewCategory({ name: "", side: "BRIDE", max_guests: 50 });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Category Management</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <h3>Create New Category</h3>
        <input
          name="name"
          value={newCategory.name}
          onChange={handleChange}
          placeholder="Category Name (e.g., Groom's Friends)"
          required
        />
        <select name="side" value={newCategory.side} onChange={handleChange}>
          <option value="BRIDE">Bride's Side</option>
          <option value="GROOM">Groom's Side</option>
        </select>
        <input
          name="max_guests"
          type="number"
          value={newCategory.max_guests}
          onChange={handleChange}
          placeholder="Max Guests"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Category"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Table displaying existing categories */}
      <h3>Existing Categories</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Side</th>
            <th>Max Guests</th>
            <th>Invitation Link</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.side}</td>
              <td>{cat.max_guests}</td>
              <td>
                {cat.invitation_token ? (
                  <button
                    className="copy-button"
                    onClick={() => handleCopyToClipboard(cat.invitation_token)}
                  >
                    Copy Link
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
