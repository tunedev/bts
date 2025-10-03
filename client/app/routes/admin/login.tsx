import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { apiClient } from "../../../utils/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient("/api/admin/login/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.success)
        throw new Error("Could not send OTP. Please check your email.");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient("/api/admin/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.success)
        throw new Error(response.error || "Invalid or expired OTP.");
      login(response.data.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-title">Admin Sign-In</h1>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <p>Enter your email to receive a sign-in code.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <p>
              We've sent a code to <strong>{email}</strong>. Please enter it
              below.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Sign In"}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => setStep(1)}
            >
              Use a different email
            </button>
          </form>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
