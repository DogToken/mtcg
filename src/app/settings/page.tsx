'use client';
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserImage from "../components/UserImage";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), image: image.trim() || undefined }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to update profile');
    } else {
      setSuccess('Profile updated successfully!');
      // Update session data
      if (session?.user) {
        session.user.name = name.trim();
        session.user.image = image.trim() || undefined;
      }
    }
    setLoading(false);
  };

  if (status === "loading") {
    return <div style={{ color: '#5eead4', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
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
      <main style={{ width: '100%', maxWidth: 600, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Profile Settings</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <UserImage src={image || session?.user?.image || "/profile.png"} alt={name || session?.user?.name || "User"} size={80} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{session?.user?.email}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Email cannot be changed</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #2a2e33',
                  background: '#181c20',
                  color: '#fff',
                  padding: 12,
                  fontSize: 16,
                }}
                placeholder="Enter your name"
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 6 }}>Profile Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #2a2e33',
                  background: '#181c20',
                  color: '#fff',
                  padding: 12,
                  fontSize: 16,
                }}
                placeholder="https://example.com/image.jpg"
              />
              <div style={{ color: '#b3b8c2', fontSize: 14, marginTop: 4 }}>
                Leave empty to use default profile image
              </div>
            </div>

            {error && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{error}</div>}
            {success && <div style={{ color: '#5eead4', marginBottom: 12 }}>{success}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#2a2e33' : '#5eead4',
                color: loading ? '#b3b8c2' : '#181c20',
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
} 