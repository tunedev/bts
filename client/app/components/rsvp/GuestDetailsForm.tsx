import React, { useState } from "react";
import { apiClient } from "../../../utils/api";

interface Props {
  onSubmit: (response: { status?: string; error?: string }) => void;
  token?: string;
  side?: string;
  categoryName?: string;
}

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

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
    guests: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setAPIError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const nigerianPhoneRegex = /^(?:\+234|0)?(70|80|81|90|91)\d{8}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!nigerianPhoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAPIError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const payload = {
      ...formData,
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
      if (!response.success) {
        throw new Error(response.error || "An unknown error occurred.");
      }
      onSubmit(response);
    } catch (err: any) {
      setAPIError(err.message);
      onSubmit({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rsvp-step">
      <h2 className="rsvp-title">Kindly Confirm Your Details</h2>
      <p className="form-subtext">All fields are required.</p>

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
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <span className="validation-error">{errors.name}</span>
          )}
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
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className="validation-error">{errors.email}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <span className="validation-error">{errors.phone}</span>
          )}
        </div>
        {apiError && !isLoading && <p className="form-error">{apiError}</p>}
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
