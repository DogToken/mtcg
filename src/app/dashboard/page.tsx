'use client';
import React, { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserImage from "../components/UserImage";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSection, setSelectedSection] = useState("Blog");
  const profileImgSrc = session?.user?.image || "/profile.png";

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
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 1200, minHeight: '70vh', boxShadow: '0 4px 32px 0 rgba(0,255,255,0.04)', borderRadius: 18, background: 'rgba(24,28,32,0.98)', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{
          width: 220,
          background: 'linear-gradient(180deg, #23272b 0%, #181c20 100%)',
          borderRight: '1px solid #23272b',
          padding: '48px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}>
          <UserImage src={profileImgSrc} alt={session?.user?.name || "User"} size={80} />
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6, color: '#fff', textAlign: 'center', wordBreak: 'break-word' }}>{session?.user?.name}</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', alignItems: 'center', marginTop: 24 }}>
            {['Blog', 'Videos', 'Art'].map(section => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                style={{
                  color: selectedSection === section ? '#fff' : '#5eead4',
                  background: selectedSection === section ? 'rgba(94,234,212,0.08)' : 'none',
                  fontWeight: 600,
                  fontSize: 18,
                  textDecoration: 'none',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 0',
                  cursor: 'pointer',
                  width: '80%',
                  marginBottom: 2,
                  transition: 'background 0.2s, color 0.2s',
                  letterSpacing: '0.01em',
                }}
              >
                {section}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main style={{ flex: 1, maxWidth: 900, padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          {selectedSection === 'Blog' && (
            <section style={{
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              marginBottom: 32,
              maxWidth: 600,
              width: '100%',
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
            </section>
          )}
          {selectedSection === 'Videos' && (
            <section style={{
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              marginBottom: 32,
              maxWidth: 600,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Post a Video</h2>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Video upload form coming soon...</div>
            </section>
          )}
          {selectedSection === 'Art' && (
            <section style={{
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              marginBottom: 32,
              maxWidth: 600,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Post Art</h2>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Art upload form coming soon...</div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
} 