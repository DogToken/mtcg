'use client';
import React, { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserImage from "../components/UserImage";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper function to strip markdown for previews
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^### (.*$)/gim, '$1') // Remove headers
    .replace(/^## (.*$)/gim, '$1')
    .replace(/^# (.*$)/gim, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/^\s*>\s+/gm, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .trim();
};

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

// Add Video type
interface Video {
  _id: string;
  url: string;
  description: string;
  date?: string;
  author?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

// Add Art type
interface Art {
  _id: string;
  url: string;
  date?: string;
  author?: {
    name?: string;
    email?: string;
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
  const [useMarkdown, setUseMarkdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Blog");
  const [selectedBlogTab, setSelectedBlogTab] = useState<'Post' | 'MyPosts'>('Post');
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedVideoTab, setSelectedVideoTab] = useState<'Post' | 'MyVideos'>('Post');
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoError, setVideoError] = useState("");
  const [videoSuccess, setVideoSuccess] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedArtTab, setSelectedArtTab] = useState<'Post' | 'MyArt'>('Post');
  const [myArt, setMyArt] = useState<Art[]>([]);
  const [artUrl, setArtUrl] = useState("");
  const [artError, setArtError] = useState("");
  const [artSuccess, setArtSuccess] = useState("");
  const [loadingArt, setLoadingArt] = useState(false);
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

  const fetchMyVideos = async () => {
    setLoadingVideos(true);
    const res = await fetch(`/api/videos`);
    const data = await res.json();
    setMyVideos((data.videos || []).filter((v: Video) => v.author?.email === session?.user?.email));
    setLoadingVideos(false);
  };

  const fetchMyArt = async () => {
    setLoadingArt(true);
    const res = await fetch(`/api/art`);
    const data = await res.json();
    setMyArt((data.art || []).filter((a: Art) => a.author?.email === session?.user?.email));
    setLoadingArt(false);
  };

  React.useEffect(() => {
    if (selectedSection === 'Blog' && selectedBlogTab === 'MyPosts' && session?.user?.email) {
      fetchMyPosts();
    }
    if (selectedSection === 'Videos' && selectedVideoTab === 'MyVideos' && session?.user?.email) {
      fetchMyVideos();
    }
    if (selectedSection === 'Art' && selectedArtTab === 'MyArt' && session?.user?.email) {
      fetchMyArt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, selectedBlogTab, selectedVideoTab, selectedArtTab, session?.user?.email]);

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

  const handlePostVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError("");
    setVideoSuccess("");
    if (!videoUrl || !videoDesc) {
      setVideoError("URL and description are required.");
      return;
    }
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl, description: videoDesc }),
    });
    const data = await res.json();
    if (!res.ok) {
      setVideoError(data.error || "Failed to post video.");
    } else {
      setVideoSuccess("Video posted!");
      setVideoUrl(""); setVideoDesc("");
    }
  };

  const handlePostArt = async (e: React.FormEvent) => {
    e.preventDefault();
    setArtError("");
    setArtSuccess("");
    if (!artUrl) {
      setArtError("Image URL is required.");
      return;
    }
    const res = await fetch("/api/art", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: artUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
      setArtError(data.error || "Failed to post art.");
    } else {
      setArtSuccess("Art posted!");
      setArtUrl("");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await fetch(`/api/blogpost?id=${id}`, { method: 'DELETE' });
    setMyPosts(myPosts.filter(p => p._id !== id));
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
    setMyVideos(myVideos.filter(v => v._id !== id));
  };

  const handleDeleteArt = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this art?')) return;
    await fetch(`/api/art`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setMyArt(myArt.filter(a => a._id !== id));
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
                  
                  {/* Markdown Toggle */}
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={useMarkdown}
                        onChange={e => setUseMarkdown(e.target.checked)}
                        style={{ width: 16, height: 16 }}
                      />
                      <span style={{ color: '#fff', fontSize: 14 }}>Use Markdown</span>
                    </label>
                    {useMarkdown && (
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                          background: showPreview ? '#5eead4' : '#2a2e33',
                          color: showPreview ? '#181c20' : '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {showPreview ? 'Edit' : 'Preview'}
                      </button>
                    )}
                  </div>

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
                    
                    {useMarkdown && showPreview ? (
                      <div style={{
                        background: '#181c20',
                        border: '1px solid #2a2e33',
                        borderRadius: 8,
                        padding: 16,
                        minHeight: 200,
                        maxHeight: 400,
                        overflowY: 'auto',
                        color: '#fff',
                        lineHeight: 1.6
                      }}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#fff'}}>{children}</h1>,
                            h2: ({children}) => <h2 style={{fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#fff'}}>{children}</h2>,
                            h3: ({children}) => <h3 style={{fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#fff'}}>{children}</h3>,
                            p: ({children}) => <p style={{marginBottom: 12, color: '#b3b8c2'}}>{children}</p>,
                            strong: ({children}) => <strong style={{color: '#fff', fontWeight: 600}}>{children}</strong>,
                            em: ({children}) => <em style={{color: '#5eead4', fontStyle: 'italic'}}>{children}</em>,
                            code: ({children}) => <code style={{background: '#2a2e33', padding: '2px 6px', borderRadius: 4, fontSize: 14, color: '#5eead4'}}>{children}</code>,
                            pre: ({children}) => <pre style={{background: '#2a2e33', padding: 12, borderRadius: 6, overflowX: 'auto', marginBottom: 12}}>{children}</pre>,
                            blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #5eead4', paddingLeft: 16, marginBottom: 12, color: '#b3b8c2'}}>{children}</blockquote>,
                            ul: ({children}) => <ul style={{marginBottom: 12, paddingLeft: 20}}>{children}</ul>,
                            ol: ({children}) => <ol style={{marginBottom: 12, paddingLeft: 20}}>{children}</ol>,
                            li: ({children}) => <li style={{marginBottom: 4, color: '#b3b8c2'}}>{children}</li>,
                            a: ({children, href}) => <a href={href} style={{color: '#5eead4', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">{children}</a>,
                          }}
                        >
                          {body}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <textarea
                        placeholder={useMarkdown ? "Body (Markdown supported)" : "Body"}
                        className="login-input"
                        style={{ minHeight: 200, resize: 'vertical' }}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        required
                      />
                    )}
                    
                    <button type="submit" className="login-btn">Post</button>
                  </form>
                  
                  {useMarkdown && (
                    <div style={{ 
                      background: '#181c20', 
                      border: '1px solid #2a2e33', 
                      borderRadius: 8, 
                      padding: 12, 
                      marginTop: 12,
                      fontSize: 12,
                      color: '#b3b8c2'
                    }}>
                      <strong style={{color: '#5eead4'}}>Markdown Tips:</strong><br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}>**bold**</code> for <strong>bold text</strong><br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}>*italic*</code> for <em>italic text</em><br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}># Heading</code> for headings<br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}>[link](url)</code> for links<br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}>`code`</code> for inline code<br/>
                      • <code style={{background: '#2a2e33', padding: '1px 4px', borderRadius: 3}}>```</code> for code blocks
                    </div>
                  )}
                  
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
                            <div style={{ color: '#b3b8c2', fontSize: 15, marginTop: 6 }}>
                              {post.excerpt || (post.content ? stripMarkdown(post.content).slice(0, 100) + (stripMarkdown(post.content).length > 100 ? '...' : '') : '')}
                            </div>
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
              <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
                <button
                  onClick={() => setSelectedVideoTab('Post')}
                  style={{
                    color: selectedVideoTab === 'Post' ? '#fff' : '#5eead4',
                    background: selectedVideoTab === 'Post' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Post a Video
                </button>
                <button
                  onClick={() => setSelectedVideoTab('MyVideos')}
                  style={{
                    color: selectedVideoTab === 'MyVideos' ? '#fff' : '#5eead4',
                    background: selectedVideoTab === 'MyVideos' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  My Videos
                </button>
              </div>
              {selectedVideoTab === 'Post' && (
                <>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Post a Video</h2>
                  <form className="login-form" onSubmit={handlePostVideo}>
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      className="login-input"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      className="login-input"
                      style={{ minHeight: 80, resize: 'vertical' }}
                      value={videoDesc}
                      onChange={e => setVideoDesc(e.target.value)}
                      required
                    />
                    <button type="submit" className="login-btn">Post</button>
                    {videoError && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{videoError}</div>}
                    {videoSuccess && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{videoSuccess}</div>}
                  </form>
                </>
              )}
              {selectedVideoTab === 'MyVideos' && (
                <div style={{ marginTop: 18 }}>
                  {loadingVideos ? (
                    <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div>
                  ) : myVideos.length === 0 ? (
                    <div style={{ color: '#b3b8c2', fontSize: 16, textAlign: 'center' }}>You have no videos yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {myVideos.map(video => (
                        <div key={video._id} style={{
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
                            <div style={{ fontWeight: 700, fontSize: 18 }}>{video.url}</div>
                            <div style={{ color: '#b3b8c2', fontSize: 15 }}>{video.date ? new Date(video.date).toLocaleDateString() : ''}</div>
                            <div style={{ 
                              color: '#b3b8c2', 
                              fontSize: 15, 
                              marginTop: 6,
                              maxHeight: '60px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.2',
                              wordBreak: 'break-word'
                            }}>
                              {video.description}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
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
              <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
                <button
                  onClick={() => setSelectedArtTab('Post')}
                  style={{
                    color: selectedArtTab === 'Post' ? '#fff' : '#5eead4',
                    background: selectedArtTab === 'Post' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Post Art
                </button>
                <button
                  onClick={() => setSelectedArtTab('MyArt')}
                  style={{
                    color: selectedArtTab === 'MyArt' ? '#fff' : '#5eead4',
                    background: selectedArtTab === 'MyArt' ? 'rgba(94,234,212,0.08)' : 'none',
                    fontWeight: 600,
                    fontSize: 18,
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  My Art
                </button>
              </div>
              {selectedArtTab === 'Post' && (
                <>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Post Art</h2>
                  <form className="login-form" onSubmit={handlePostArt}>
                    <input
                      type="text"
                      placeholder="Image URL (jpg, png, gif, webp)"
                      className="login-input"
                      value={artUrl}
                      onChange={e => setArtUrl(e.target.value)}
                      required
                    />
                    <button type="submit" className="login-btn">Post</button>
                    {artError && <div style={{ color: '#ff4d4f', marginTop: 12, textAlign: 'center' }}>{artError}</div>}
                    {artSuccess && <div style={{ color: '#5eead4', marginTop: 12, textAlign: 'center' }}>{artSuccess}</div>}
                  </form>
                </>
              )}
              {selectedArtTab === 'MyArt' && (
                <div style={{ marginTop: 18 }}>
                  {loadingArt ? (
                    <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div>
                  ) : myArt.length === 0 ? (
                    <div style={{ color: '#b3b8c2', fontSize: 16, textAlign: 'center' }}>You have no art yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {myArt.map(art => (
                        <div key={art._id} style={{
                          background: 'rgba(24,28,32,0.98)',
                          borderRadius: 12,
                          padding: 18,
                          boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 18,
                        }}>
                          <img
                            src={art.url}
                            alt="Art"
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #5eead4', boxShadow: '0 0 8px #00ffff' }}
                            onError={e => (e.currentTarget.src = '/profile.png')}
                            loading="lazy"
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 18 }}>{art.url}</div>
                            <div style={{ color: '#b3b8c2', fontSize: 15 }}>{art.date ? new Date(art.date).toLocaleDateString() : ''}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteArt(art._id)}
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
        </main>
      </div>
    </div>
  );
} 