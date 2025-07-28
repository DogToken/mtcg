'use client';
import React, { useState } from "react";
import Header from "../components/Header";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to generate reset link");
      } else {
        setSuccess(data.message || "Reset link generated successfully!");
        setResetLink(data.resetLink);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <p style={{ textAlign: 'center', marginBottom: 24, color: '#a0a0a0' }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{success}</div>}
            {resetLink && (
              <div style={{ marginTop: 16, padding: 16, background: 'rgba(94, 234, 212, 0.1)', borderRadius: 8, border: '1px solid #5eead4' }}>
                <p style={{ marginBottom: 8, fontSize: 14, color: '#5eead4' }}>Reset Link:</p>
                <input
                  type="text"
                  value={resetLink}
                  readOnly
                  style={{
                    width: '100%',
                    padding: 8,
                    background: '#23272b',
                    border: '1px solid #2a2e33',
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resetLink);
                    alert('Link copied to clipboard!');
                  }}
                  style={{
                    marginTop: 8,
                    padding: '4px 8px',
                    background: '#5eead4',
                    color: '#181c20',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Copy Link
                </button>
              </div>
            )}
          </form>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <a href="/login" className="neon-link">Back to Login</a>
          </div>
        </section>
      </main>
    </div>
  );
} 