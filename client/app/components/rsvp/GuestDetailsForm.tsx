import React, { useState } from "react";
import { apiClient } from "utils/api";

interface Props {
  onSubmit: (response: { status?: string; error?: string }) => void;
  token?: string;
  side?: string;
  categoryName?: string;
}

export default function GuestDetailsForm({
  onSubmit,
  token,
  side,
  categoryName,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: parseInt(formData.guests, 10),
      token: token,
      selectedSide: side,
      categoryName,
    };

    try {
      // Point this to your backend API endpoint
      const response = await apiClient("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }

      onSubmit(result); // Pass the full result object
    } catch (err: any) {
      setError(err.message);
      onSubmit({ error: err.message }); // Also pass error up to parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rsvp-step">
      <h2 className="rsvp-title">Kindly Confirm Your Details</h2>
      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">Number of Guests (including yourself)</label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        {error && !isLoading && <p className="form-error">{error}</p>}
        <button
          type="submit"
          className="rsvp-button submit"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit RSVP"}
        </button>
      </form>
    </div>
  );
}
