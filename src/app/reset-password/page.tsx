'use client';
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #181c20 0%, #23272b 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 0',
      }}>
        <Header />
        <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
          <section style={{
            background: 'rgba(34, 38, 44, 0.95)',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
            marginBottom: 32,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Reset Password</h2>
            {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <a href="/forgot-password" className="neon-link">Request New Reset Link</a>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #181c20 0%, #23272b 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 0',
    }}>
      <Header />
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
          marginBottom: 32,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Set New Password</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="login-input"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{success}</div>}
          </form>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <a href="/login" className="neon-link">Back to Login</a>
          </div>
        </section>
      </main>
    </div>
  );
} 