'use client';
import React, { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserImage from "../components/UserImage";

// Add BlogPost type
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  author?: {
    name?: string;
    image?: string;
  };
}

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
  const [selectedBlogTab, setSelectedBlogTab] = useState<'Post' | 'MyPosts'>('Post');
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const profileImgSrc = session?.user?.image || "/profile.png";

  React.useEffect(() => {
    if (typeof window !== 'undefined' && status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchMyPosts = async () => {
    setLoadingPosts(true);
    const res = await fetch(`/api/blogpost?authorEmail=${session?.user?.email}`);
    const data = await res.json();
    setMyPosts(data.posts || []);
    setLoadingPosts(false);
  };

  React.useEffect(() => {
    if (selectedSection === 'Blog' && selectedBlogTab === 'MyPosts' && session?.user?.email) {
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, selectedBlogTab, session?.user?.email]);

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

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await fetch(`/api/blogpost?id=${id}`, { method: 'DELETE' });
    setMyPosts(myPosts.filter(p => p._id !== id));
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
              <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
                <button
                  onClick={() => setSelectedBlogTab('Post')}
                  style={{
                    color: selectedBlogTab === 'Post' ? '#fff' : '#5eead4',
                    background: selectedBlogTab === 'Post' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Post a Blog
                </button>
                <button
                  onClick={() => setSelectedBlogTab('MyPosts')}
                  style={{
                    color: selectedBlogTab === 'MyPosts' ? '#fff' : '#5eead4',
                    background: selectedBlogTab === 'MyPosts' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  My Posts
                </button>
              </div>
              {selectedBlogTab === 'Post' && (
                <>
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
                  </form>
                  {error && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{error}</div>}
                  {success && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{success}</div>}
                </>
              )}
              {selectedBlogTab === 'MyPosts' && (
                <div style={{ marginTop: 18 }}>
                  {loadingPosts ? (
                    <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div>
                  ) : myPosts.length === 0 ? (
                    <div style={{ color: '#b3b8c2', fontSize: 16, textAlign: 'center' }}>You have no posts yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {myPosts.map(post => (
                        <div key={post._id} style={{
                          background: 'rgba(24,28,32,0.98)',
                          borderRadius: 12,
                          padding: 18,
                          boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 18,
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 18 }}>{post.title}</div>
                            <div style={{ color: '#b3b8c2', fontSize: 15 }}>{post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
                            <div style={{ color: '#b3b8c2', fontSize: 15, marginTop: 6 }}>{post.excerpt || (post.content ? post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '') : '')}</div>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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