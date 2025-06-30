'use client';
import React, { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    if (typeof window !== 'undefined' && status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div style={{ color: '#5eead4', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title || !slug || !body) {
      setError("Title, slug, and body are required.");
      return;
    }
    const res = await fetch("/api/blogpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, tags, slug, body }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to post blog.");
    } else {
      setSuccess("Blog post created!");
      setTitle(""); setTags(""); setSlug(""); setBody("");
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
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Post a Blog</h2>
          <form className="login-form" onSubmit={handlePost}>
            <input
              type="text"
              placeholder="Title"
              className="login-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="login-input"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            <input
              type="text"
              placeholder="Slug (unique, e.g. my-first-post)"
              className="login-input"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
            <textarea
              placeholder="Body"
              className="login-input"
              style={{ minHeight: 120, resize: 'vertical' }}
              value={body}
              onChange={e => setBody(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Post</button>
            {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{success}</div>}
          </form>
          {/* User Info Card */}
          {session && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{session.user?.name}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>{session.user?.email}</div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{
                  marginTop: 18,
                  padding: '10px 24px',
                  borderRadius: 8,
                  background: '#ff4d4f',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
                onMouseOut={e => (e.currentTarget.style.background = '#ff4d4f')}
              >
                Sign Out
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 