'use client';
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/blockreg').then(res => res.json()).then(data => {
      setBlocked(data.blocked);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, image }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
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
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Register</h2>
          {blocked ? (
            <div style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 18, textAlign: 'center', margin: '32px 0' }}>
              Registrations are currently blocked by the admin.
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                className="login-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="login-input"
                value={image}
                onChange={e => setImage(e.target.value)}
              />
              <button
                type="submit"
                className="login-btn"
              >
                Register
              </button>
              {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
              {success && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{success}</div>}
            </form>
          )}
        </section>
      </main>
    </div>
  );
} 