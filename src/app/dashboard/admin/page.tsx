'use client';
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserImage from "../../components/UserImage";
import { FooterContent } from "../../components/Footer";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
};

const defaultFooterContent: FooterContent = {
  about: "A modern, open community for sharing, learning, and connecting. Join us on our journey!",
  links: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Videos", href: "/videos" },
    { label: "Art", href: "/art" },
    { label: "Info", href: "/info" },
    { label: "Ecosystem", href: "/ecosystem" },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com/" },
    { label: "Discord", href: "https://discord.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockReg, setBlockReg] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Users' | 'Content' | 'Site' | 'Security' | 'Content Management'>('Users');
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [footerLoading, setFooterLoading] = useState(false);
  const [footerSuccess, setFooterSuccess] = useState('');
  const [footerError, setFooterError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [ecoWelcome, setEcoWelcome] = useState<string>("");
  const [ecoWelcomeLoading, setEcoWelcomeLoading] = useState(false);
  const [ecoWelcomeSuccess, setEcoWelcomeSuccess] = useState("");
  const [ecoWelcomeError, setEcoWelcomeError] = useState("");
  const [ecoEngagement, setEcoEngagement] = useState<string>("");
  const [ecoEngagementLoading, setEcoEngagementLoading] = useState(false);
  const [ecoEngagementSuccess, setEcoEngagementSuccess] = useState("");
  const [ecoEngagementError, setEcoEngagementError] = useState("");
  const [ecoResources, setEcoResources] = useState<string>("");
  const [ecoResourcesLoading, setEcoResourcesLoading] = useState(false);
  const [ecoResourcesSuccess, setEcoResourcesSuccess] = useState("");
  const [ecoResourcesError, setEcoResourcesError] = useState("");
  const [heroSlides, setHeroSlides] = useState<{ image: string; alt: string; text: string }[]>([]);
  const [heroSlidesLoading, setHeroSlidesLoading] = useState(false);
  const [heroSlidesSuccess, setHeroSlidesSuccess] = useState("");
  const [heroSlidesError, setHeroSlidesError] = useState("");
  const [siteInfo, setSiteInfo] = useState({
    name: '',
    title: '',
    description: '',
    header: '',
    logo: '',
    favicon: '',
  });
  const [siteInfoLoading, setSiteInfoLoading] = useState(false);
  const [siteInfoSuccess, setSiteInfoSuccess] = useState('');
  const [siteInfoError, setSiteInfoError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  
  // Content Management State
  interface ContentItem {
    _id: string;
    title?: string;
    content?: string;
    description?: string;
    url?: string;
    image?: string;
    slug?: string;
    author?: {
      name?: string;
      email?: string;
      image?: string;
    };
    date?: string;
  }

  const [allPosts, setAllPosts] = useState<ContentItem[]>([]);
  const [allVideos, setAllVideos] = useState<ContentItem[]>([]);
  const [allArt, setAllArt] = useState<ContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [editContentType, setEditContentType] = useState<'post' | 'video' | 'art' | null>(null);
  const [editContentData, setEditContentData] = useState({
    title: '',
    content: '',
    description: '',
    url: '',
    image: ''
  });
  const [editContentError, setEditContentError] = useState('');
  const [editContentSuccess, setEditContentSuccess] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetch("/api/admin/users").then(res => res.json()).then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
      fetch("/api/admin/blockreg").then(res => res.json()).then(data => {
        setBlockReg(data.blocked || false);
      });
      if (selectedTab === 'Content' || selectedTab === 'Site') {
        fetchFooter();
        fetchEcoWelcome();
        fetchEcoEngagement();
      }
      if (selectedTab === 'Content Management') {
        fetchAllContent();
        fetchEcoResources();
        fetchHeroSlides();
        fetchSiteInfo();
      }
    }
  }, [status, session, router, selectedTab]);

  const handleRemove = async (id: string) => {
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u._id !== id));
  };

  const handleToggleBlock = async () => {
    await fetch('/api/admin/blockreg', { method: 'POST', body: JSON.stringify({ blocked: !blockReg }), headers: { 'Content-Type': 'application/json' } });
    setBlockReg(!blockReg);
  };

  const fetchFooter = async () => {
    setFooterLoading(true);
    const res = await fetch('/api/admin/footer');
    const data = await res.json();
    setFooterContent(data.content || defaultFooterContent);
    setFooterLoading(false);
  };

  const handleFooterChange = (field: keyof FooterContent, value: string) => {
    setFooterContent((prev) => prev ? { ...prev, [field]: value } : prev);
  };
  const handleFooterLinkChange = (idx: number, field: 'label' | 'href', value: string) => {
    setFooterContent((prev) => prev ? {
      ...prev,
      links: prev.links.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    } : prev);
  };
  const handleFooterSocialChange = (idx: number, field: 'label' | 'href', value: string) => {
    setFooterContent((prev) => prev ? {
      ...prev,
      socials: prev.socials.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    } : prev);
  };
  const handleFooterSave = async () => {
    setFooterLoading(true);
    setFooterSuccess('');
    setFooterError('');
    const res = await fetch('/api/admin/footer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: footerContent }),
    });
    if (res.ok) setFooterSuccess('Saved!');
    else setFooterError('Failed to save.');
    setFooterLoading(false);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditImage(user.image || "");
    setEditRole(user.role || "user");
    setEditError("");
    setEditSuccess("");
  };

  const closeEdit = () => setEditingUser(null);

  const handleEditSave = async () => {
    setEditError("");
    setEditSuccess("");
    if (!editingUser) return;
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingUser._id, name: editName, image: editImage, role: editRole }),
    });
    const data = await res.json();
    if (!res.ok) {
      setEditError(data.error || 'Failed to update user');
    } else {
      setEditSuccess('User updated!');
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, name: editName, image: editImage, role: editRole } : u));
      setTimeout(() => setEditingUser(null), 1000);
    }
  };

  const fetchEcoWelcome = async () => {
    setEcoWelcomeLoading(true);
    const res = await fetch('/api/admin/ecosystem-welcome');
    const data = await res.json();
    setEcoWelcome(data.content || "");
    setEcoWelcomeLoading(false);
  };
  const fetchEcoEngagement = async () => {
    setEcoEngagementLoading(true);
    const res = await fetch('/api/admin/ecosystem-engagement');
    const data = await res.json();
    setEcoEngagement(data.content || "");
    setEcoEngagementLoading(false);
  };
  const fetchEcoResources = async () => {
    setEcoResourcesLoading(true);
    const res = await fetch('/api/admin/ecosystem-resources');
    const data = await res.json();
    setEcoResources(data.content || "");
    setEcoResourcesLoading(false);
  };

  const handleEcoWelcomeSave = async () => {
    setEcoWelcomeLoading(true);
    setEcoWelcomeSuccess("");
    setEcoWelcomeError("");
    const res = await fetch('/api/admin/ecosystem-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: ecoWelcome }),
    });
    if (res.ok) setEcoWelcomeSuccess('Saved!');
    else setEcoWelcomeError('Failed to save.');
    setEcoWelcomeLoading(false);
  };
  const handleEcoEngagementSave = async () => {
    setEcoEngagementLoading(true);
    setEcoEngagementSuccess("");
    setEcoEngagementError("");
    const res = await fetch('/api/admin/ecosystem-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: ecoEngagement }),
    });
    if (res.ok) setEcoEngagementSuccess('Saved!');
    else setEcoEngagementError('Failed to save.');
    setEcoEngagementLoading(false);
  };
  const handleEcoResourcesSave = async () => {
    setEcoResourcesLoading(true);
    setEcoResourcesSuccess("");
    setEcoResourcesError("");
    const res = await fetch('/api/admin/ecosystem-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: ecoResources }),
    });
    if (res.ok) setEcoResourcesSuccess('Saved!');
    else setEcoResourcesError('Failed to save.');
    setEcoResourcesLoading(false);
  };

  const fetchHeroSlides = async () => {
    setHeroSlidesLoading(true);
    const res = await fetch('/api/admin/hero');
    const data = await res.json();
    setHeroSlides(data.slides || []);
    setHeroSlidesLoading(false);
  };

  const handleHeroSlideChange = (idx: number, field: 'image' | 'alt' | 'text', value: string) => {
    setHeroSlides(prev => prev.map((slide, i) => i === idx ? { ...slide, [field]: value } : slide));
  };
  const handleAddHeroSlide = () => {
    setHeroSlides(prev => [...prev, { image: '', alt: '', text: '' }]);
  };
  const handleRemoveHeroSlide = (idx: number) => {
    setHeroSlides(prev => prev.filter((_, i) => i !== idx));
  };
  const handleMoveHeroSlide = (idx: number, dir: -1 | 1) => {
    setHeroSlides(prev => {
      const slides = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= slides.length) return slides;
      [slides[idx], slides[newIdx]] = [slides[newIdx], slides[idx]];
      return slides;
    });
  };
  const handleHeroSlidesSave = async () => {
    setHeroSlidesLoading(true);
    setHeroSlidesSuccess("");
    setHeroSlidesError("");
    const res = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slides: heroSlides }),
    });
    if (res.ok) setHeroSlidesSuccess('Saved!');
    else setHeroSlidesError('Failed to save.');
    setHeroSlidesLoading(false);
  };

  const fetchSiteInfo = async () => {
    setSiteInfoLoading(true);
    const res = await fetch('/api/admin/siteinfo');
    const data = await res.json();
    setSiteInfo(data.info || { name: '', title: '', description: '', header: '', logo: '', favicon: '' });
    setSiteInfoLoading(false);
  };

  const handleSiteInfoChange = (field: keyof typeof siteInfo, value: string) => {
    setSiteInfo(prev => ({ ...prev, [field]: value }));
  };
  const handleSiteInfoSave = async () => {
    setSiteInfoLoading(true);
    setSiteInfoSuccess('');
    setSiteInfoError('');
    const res = await fetch('/api/admin/siteinfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ info: siteInfo }),
    });
    if (res.ok) setSiteInfoSuccess('Saved!');
    else setSiteInfoError('Failed to save.');
    setSiteInfoLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess('');
    setResetError('');
    setResetLink('');

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setResetError(data.error || "Failed to generate reset link");
      } else {
        setResetSuccess("Reset link generated successfully!");
        setResetLink(data.resetLink);
      }
    } catch {
      setResetError("An error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Content Management Functions
  const fetchAllContent = async () => {
    setContentLoading(true);
    try {
      const [postsRes, videosRes, artRes] = await Promise.all([
        fetch('/api/blogpost').then(r => r.json()),
        fetch('/api/videos').then(r => r.json()),
        fetch('/api/art').then(r => r.json())
      ]);
      
      setAllPosts(postsRes.posts || []);
      setAllVideos(videosRes.videos || []);
      setAllArt(artRes.art || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const openContentEdit = (content: ContentItem, type: 'post' | 'video' | 'art') => {
    setEditingContent(content);
    setEditContentType(type);
    setEditContentData({
      title: content.title || '',
      content: content.content || '',
      description: content.description || '',
      url: content.url || '',
      image: content.image || ''
    });
    setEditContentError('');
    setEditContentSuccess('');
  };

  const closeContentEdit = () => {
    setEditingContent(null);
    setEditContentType(null);
    setEditContentData({ title: '', content: '', description: '', url: '', image: '' });
  };

  const handleContentEditSave = async () => {
    if (!editingContent || !editContentType) return;
    
    setEditContentError('');
    setEditContentSuccess('');
    
    try {
      let endpoint = '';
      let payload: Record<string, unknown> = {};
      
      switch (editContentType) {
        case 'post':
          endpoint = '/api/blogpost';
          payload = {
            id: editingContent._id,
            title: editContentData.title,
            content: editContentData.content
          };
          break;
        case 'video':
          endpoint = '/api/videos';
          payload = {
            id: editingContent._id,
            title: editContentData.title,
            description: editContentData.description,
            url: editContentData.url
          };
          break;
        case 'art':
          endpoint = '/api/art';
          payload = {
            id: editingContent._id,
            title: editContentData.title,
            description: editContentData.description,
            image: editContentData.image
          };
          break;
      }
      
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const data = await res.json();
        setEditContentError(data.error || 'Failed to update content');
      } else {
        setEditContentSuccess('Content updated successfully!');
        fetchAllContent(); // Refresh the content list
        setTimeout(() => closeContentEdit(), 1500);
      }
    } catch {
      setEditContentError('An error occurred. Please try again.');
    }
  };

  const handleContentDelete = async (content: ContentItem, type: 'post' | 'video' | 'art') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      let endpoint = '';
      
      switch (type) {
        case 'post':
          endpoint = `/api/blogpost?id=${content._id}`;
          break;
        case 'video':
          endpoint = `/api/videos?id=${content._id}`;
          break;
        case 'art':
          endpoint = `/api/art?id=${content._id}`;
          break;
      }
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete content');
      } else {
        alert(`${type} deleted successfully!`);
        fetchAllContent(); // Refresh the content list
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  if (status === "loading" || loading) {
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
      <Header editableHeader />
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#5eead4', margin: 0, letterSpacing: '-0.03em', flex: 1 }}>Admin Dashboard</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setSelectedTab('Users')} style={{ color: selectedTab === 'Users' ? '#fff' : '#5eead4', background: selectedTab === 'Users' ? 'rgba(94,234,212,0.18)' : 'none', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>👥 Users</button>
            <button onClick={() => setSelectedTab('Content')} style={{ color: selectedTab === 'Content' ? '#fff' : '#5eead4', background: selectedTab === 'Content' ? 'rgba(94,234,212,0.18)' : 'none', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>📝 Content</button>
            <button onClick={() => setSelectedTab('Content Management')} style={{ color: selectedTab === 'Content Management' ? '#fff' : '#5eead4', background: selectedTab === 'Content Management' ? 'rgba(94,234,212,0.18)' : 'none', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>🗂️ Content Management</button>
            <button onClick={() => setSelectedTab('Site')} style={{ color: selectedTab === 'Site' ? '#fff' : '#5eead4', background: selectedTab === 'Site' ? 'rgba(94,234,212,0.18)' : 'none', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>⚙️ Site</button>
            <button onClick={() => setSelectedTab('Security')} style={{ color: selectedTab === 'Security' ? '#fff' : '#5eead4', background: selectedTab === 'Security' ? 'rgba(94,234,212,0.18)' : 'none', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>🔒 Security</button>
          </div>
        </div>
        {selectedTab === 'Users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Registration Control */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>🔐 Registration Control</h3>
              <button onClick={handleToggleBlock} style={{ 
                padding: '12px 24px', 
                borderRadius: 8, 
                background: blockReg ? '#ff4d4f' : '#5eead4', 
                color: '#fff', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
                fontSize: 16
              }}>
                {blockReg ? '🚫 Unblock Registrations' : '✅ Allow Registrations'}
              </button>
              <p style={{ color: '#b3b8c2', fontSize: 14, marginTop: 8 }}>
                {blockReg ? 'New user registrations are currently blocked.' : 'New users can currently register accounts.'}
              </p>
            </div>

            {/* User Management */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>👥 User Management</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {users.map((user) => (
                  <div key={user._id} style={{
                    background: '#181c20',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: '1px solid #2a2e33'
                  }}>
                    <UserImage src={user.image} alt={user.name} size={48} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>{user.name}</div>
                      <div style={{ color: '#b3b8c2', fontSize: 15 }}>{user.email}</div>
                      <div style={{ 
                        color: user.role === 'admin' ? '#ff4d4f' : '#5eead4', 
                        fontWeight: 600, 
                        fontSize: 14,
                        background: user.role === 'admin' ? 'rgba(255,77,79,0.1)' : 'rgba(94,234,212,0.1)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        display: 'inline-block',
                        marginTop: 4
                      }}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(user)} style={{ 
                        background: '#5eead4', 
                        color: '#181c20', 
                        border: 'none', 
                        borderRadius: 6, 
                        padding: '8px 12px', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        fontSize: 14
                      }}>✏️ Edit</button>
                      <button
                        onClick={() => handleRemove(user._id)}
                        style={{ 
                          background: '#ff4d4f', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 6, 
                          padding: '8px 12px', 
                          fontWeight: 700, 
                          cursor: user.role === 'admin' || user.email === session?.user?.email ? 'not-allowed' : 'pointer', 
                          opacity: user.role === 'admin' || user.email === session?.user?.email ? 0.5 : 1,
                          fontSize: 14
                        }}
                        disabled={user.role === 'admin' || user.email === session?.user?.email}
                      >🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedTab === 'Content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Footer Settings */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>📄 Footer Settings</h3>
              {footerLoading && <div style={{ color: '#5eead4', marginBottom: 12 }}>Loading...</div>}
              {footerError && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{footerError}</div>}
              {footerSuccess && <div style={{ color: '#5eead4', marginBottom: 12 }}>{footerSuccess}</div>}
              {footerContent && (
                <form onSubmit={e => { e.preventDefault(); handleFooterSave(); }}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>About Section</label>
                    <textarea value={footerContent.about} onChange={e => handleFooterChange('about', e.target.value)} style={{ width: '100%', minHeight: 60, marginTop: 6, borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 10, fontSize: 15 }} />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>Quick Links</label>
                    {footerContent.links.map((link, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <input value={link.label} onChange={e => handleFooterLinkChange(idx, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                        <input value={link.href} onChange={e => handleFooterLinkChange(idx, 'href', e.target.value)} placeholder="URL" style={{ flex: 2, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>Social Links</label>
                    {footerContent.socials.map((social, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <input value={social.label} onChange={e => handleFooterSocialChange(idx, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                        <input value={social.href} onChange={e => handleFooterSocialChange(idx, 'href', e.target.value)} placeholder="URL" style={{ flex: 2, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" style={{ background: '#5eead4', color: '#181c20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 17, cursor: 'pointer', marginTop: 8 }}>💾 Save Footer</button>
                </form>
              )}
            </div>

            {/* Hero Slides */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>🎬 Hero Slides</h3>
              {heroSlides.map((slide, idx) => (
                <div key={idx} style={{ marginBottom: 24, border: '1px solid #5eead4', borderRadius: 8, padding: 16, background: '#181c20' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                    <input type="text" value={slide.image} onChange={e => handleHeroSlideChange(idx, 'image', e.target.value)} placeholder="Image URL" style={{ flex: 2, fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                    <input type="text" value={slide.alt} onChange={e => handleHeroSlideChange(idx, 'alt', e.target.value)} placeholder="Alt text" style={{ flex: 1, fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                    <button onClick={() => handleRemoveHeroSlide(idx)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>🗑️</button>
                    <button onClick={() => handleMoveHeroSlide(idx, -1)} disabled={idx === 0} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 700, cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.5 : 1 }}>⬆️</button>
                    <button onClick={() => handleMoveHeroSlide(idx, 1)} disabled={idx === heroSlides.length - 1} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 700, cursor: idx === heroSlides.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === heroSlides.length - 1 ? 0.5 : 1 }}>⬇️</button>
                  </div>
                  <textarea value={slide.text} onChange={e => handleHeroSlideChange(idx, 'text', e.target.value)} rows={2} placeholder="Hero text (supports HTML)" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff', marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#5eead4', marginBottom: 4 }}>Preview:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {slide.image && <img src={slide.image} alt={slide.alt} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #5eead4' }} />}
                        <div dangerouslySetInnerHTML={{ __html: slide.text || '' }} style={{ color: '#fff', fontSize: 16 }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleAddHeroSlide} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>➕ Add Slide</button>
                <button onClick={handleHeroSlidesSave} disabled={heroSlidesLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>💾 Save Slides</button>
              </div>
              {heroSlidesLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
              {heroSlidesSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{heroSlidesSuccess}</span>}
              {heroSlidesError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{heroSlidesError}</span>}
            </div>
          </div>
        )}

        {selectedTab === 'Site' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Site Information */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>⚙️ Site Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Site Name</label>
                  <input type="text" value={siteInfo.name} onChange={e => handleSiteInfoChange('name', e.target.value)} placeholder="Site Name" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Site Title (SEO)</label>
                  <input type="text" value={siteInfo.title} onChange={e => handleSiteInfoChange('title', e.target.value)} placeholder="Site Title (SEO)" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Site Description (SEO)</label>
                  <input type="text" value={siteInfo.description} onChange={e => handleSiteInfoChange('description', e.target.value)} placeholder="Site Description (SEO)" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Header Text</label>
                  <input type="text" value={siteInfo.header} onChange={e => handleSiteInfoChange('header', e.target.value)} placeholder="Header Text" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Logo URL</label>
                  <input type="text" value={siteInfo.logo} onChange={e => handleSiteInfoChange('logo', e.target.value)} placeholder="Logo URL (e.g. /profile.png)" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 16, color: '#fff', display: 'block', marginBottom: 4 }}>Favicon URL</label>
                  <input type="text" value={siteInfo.favicon || ''} onChange={e => handleSiteInfoChange('favicon', e.target.value)} placeholder="Favicon URL (e.g. /favicon.ico or https://...)" style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }} />
                  {siteInfo.favicon && <img src={siteInfo.favicon} alt="Favicon preview" style={{ width: 32, height: 32, borderRadius: 4, border: '1px solid #5eead4', background: '#fff', marginTop: 8 }} onError={e => { (e.target as HTMLImageElement).src = '/favicon.ico'; }} />}
                </div>
              </div>
              <button onClick={handleSiteInfoSave} disabled={siteInfoLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>💾 Save Site Info</button>
              {siteInfoLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
              {siteInfoSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{siteInfoSuccess}</span>}
              {siteInfoError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{siteInfoError}</span>}
            </div>

            {/* Ecosystem Content */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>🌐 Ecosystem Content</h3>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Welcome Section</h4>
                <textarea
                  value={ecoWelcome}
                  onChange={e => setEcoWelcome(e.target.value)}
                  rows={4}
                  style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                  placeholder="Welcome message for the top of the ecosystem page..."
                />
                <button onClick={handleEcoWelcomeSave} disabled={ecoWelcomeLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>💾 Save</button>
                {ecoWelcomeLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
                {ecoWelcomeSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoWelcomeSuccess}</span>}
                {ecoWelcomeError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoWelcomeError}</span>}
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Engagement Section</h4>
                <textarea
                  value={ecoEngagement}
                  onChange={e => setEcoEngagement(e.target.value)}
                  rows={4}
                  style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                  placeholder="Engagement opportunities to show above profiles..."
                />
                <button onClick={handleEcoEngagementSave} disabled={ecoEngagementLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>💾 Save</button>
                {ecoEngagementLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
                {ecoEngagementSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoEngagementSuccess}</span>}
                {ecoEngagementError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoEngagementError}</span>}
              </div>

              <div>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Resource Hub Section</h4>
                <textarea
                  value={ecoResources}
                  onChange={e => setEcoResources(e.target.value)}
                  rows={4}
                  style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                  placeholder="Resource hub content to show below profiles..."
                />
                <button onClick={handleEcoResourcesSave} disabled={ecoResourcesLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>💾 Save</button>
                {ecoResourcesLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
                {ecoResourcesSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoResourcesSuccess}</span>}
                {ecoResourcesError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoResourcesError}</span>}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'Security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Password Reset */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#5eead4' }}>🔒 Password Reset</h3>
              <p style={{ color: '#b3b8c2', fontSize: 15, marginBottom: 16 }}>Generate password reset links for any user account.</p>
              <form onSubmit={handlePasswordReset}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <input
                    type="email"
                    placeholder="User Email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                    disabled={resetLoading}
                    style={{ flex: 1, fontSize: 15, borderRadius: 6, border: '1px solid #5eead4', padding: 8, background: '#23272b', color: '#fff' }}
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {resetLoading ? "Generating..." : "🔗 Generate Reset Link"}
                  </button>
                </div>
                {resetError && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{resetError}</div>}
                {resetSuccess && <div style={{ color: '#5eead4', marginBottom: 12 }}>{resetSuccess}</div>}
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
                      📋 Copy Link
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {selectedTab === 'Content Management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#5eead4' }}>🗂️ Content Management</h3>
              <button 
                onClick={fetchAllContent} 
                disabled={contentLoading}
                style={{ 
                  background: '#5eead4', 
                  color: '#181c20', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '8px 16px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {contentLoading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {/* Blog Posts */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>📝 Blog Posts ({allPosts.length})</h4>
              {allPosts.length === 0 ? (
                <div style={{ color: '#b3b8c2', textAlign: 'center', padding: 20 }}>No blog posts found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allPosts.map((post) => (
                    <div key={post._id} style={{
                      background: '#181c20',
                      borderRadius: 12,
                      padding: 16,
                      border: '1px solid #2a2e33',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{post.title}</div>
                        <div style={{ color: '#b3b8c2', fontSize: 14, marginBottom: 4 }}>
                          By: {post.author?.name || 'Unknown'} • {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ color: '#5eead4', fontSize: 12 }}>Slug: {post.slug}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openContentEdit(post, 'post')}
                          style={{
                            background: '#5eead4',
                            color: '#181c20',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleContentDelete(post, 'post')}
                          style={{
                            background: '#ff4d4f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>🎥 Videos ({allVideos.length})</h4>
              {allVideos.length === 0 ? (
                <div style={{ color: '#b3b8c2', textAlign: 'center', padding: 20 }}>No videos found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allVideos.map((video) => (
                    <div key={video._id} style={{
                      background: '#181c20',
                      borderRadius: 12,
                      padding: 16,
                      border: '1px solid #2a2e33',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{video.description}</div>
                        <div style={{ color: '#b3b8c2', fontSize: 14, marginBottom: 4 }}>
                          By: {video.author?.name || 'Unknown'} • {video.date ? new Date(video.date).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ color: '#5eead4', fontSize: 12 }}>URL: {video.url}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openContentEdit(video, 'video')}
                          style={{
                            background: '#5eead4',
                            color: '#181c20',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleContentDelete(video, 'video')}
                          style={{
                            background: '#ff4d4f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Art */}
            <div style={{ background: '#23272b', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>🎨 Art ({allArt.length})</h4>
              {allArt.length === 0 ? (
                <div style={{ color: '#b3b8c2', textAlign: 'center', padding: 20 }}>No art found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allArt.map((art) => (
                    <div key={art._id} style={{
                      background: '#181c20',
                      borderRadius: 12,
                      padding: 16,
                      border: '1px solid #2a2e33',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{art.title}</div>
                        <div style={{ color: '#b3b8c2', fontSize: 14, marginBottom: 4 }}>
                          By: {art.author?.name || 'Unknown'} • {art.date ? new Date(art.date).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ color: '#5eead4', fontSize: 12 }}>Image: {art.image}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openContentEdit(art, 'art')}
                          style={{
                            background: '#5eead4',
                            color: '#181c20',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleContentDelete(art, 'art')}
                          style={{
                            background: '#ff4d4f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} onClick={closeEdit}>
          <div style={{ background: '#23272b', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 24px #00ffff', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Edit User</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Profile Image URL</label>
              <input value={editImage} onChange={e => setEditImage(e.target.value)} style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, fontSize: 15 }}>Role</label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, marginTop: 4 }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {editError && <div style={{ color: '#ff4d4f', marginBottom: 10 }}>{editError}</div>}
            {editSuccess && <div style={{ color: '#5eead4', marginBottom: 10 }}>{editSuccess}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={handleEditSave} style={{ background: '#5eead4', color: '#181c20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Save</button>
              <button onClick={closeEdit} style={{ background: '#23272b', color: '#fff', fontWeight: 700, border: '1px solid #5eead4', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Edit Modal */}
      {editingContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} onClick={closeContentEdit}>
          <div style={{ 
            background: '#23272b', 
            borderRadius: 16, 
            padding: 32, 
            minWidth: 500, 
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 2px 24px #00ffff', 
            position: 'relative' 
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>
              Edit {editContentType === 'post' ? 'Blog Post' : editContentType === 'video' ? 'Video' : 'Art'}
            </h3>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>
                {editContentType === 'post' ? 'Title' : editContentType === 'video' ? 'Description' : 'Title'}
              </label>
              <input 
                value={editContentData.title} 
                onChange={e => setEditContentData(prev => ({ ...prev, title: e.target.value }))} 
                style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15 }} 
              />
            </div>
            
            {editContentType === 'post' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>Content</label>
                <textarea 
                  value={editContentData.content} 
                  onChange={e => setEditContentData(prev => ({ ...prev, content: e.target.value }))} 
                  rows={8}
                  style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, resize: 'vertical' }} 
                />
              </div>
            )}
            
            {editContentType === 'video' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea 
                    value={editContentData.description} 
                    onChange={e => setEditContentData(prev => ({ ...prev, description: e.target.value }))} 
                    rows={4}
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, resize: 'vertical' }} 
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>Video URL</label>
                  <input 
                    value={editContentData.url} 
                    onChange={e => setEditContentData(prev => ({ ...prev, url: e.target.value }))} 
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15 }} 
                  />
                </div>
              </>
            )}
            
            {editContentType === 'art' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea 
                    value={editContentData.description} 
                    onChange={e => setEditContentData(prev => ({ ...prev, description: e.target.value }))} 
                    rows={4}
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, resize: 'vertical' }} 
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'block', marginBottom: 4 }}>Image URL</label>
                  <input 
                    value={editContentData.image} 
                    onChange={e => setEditContentData(prev => ({ ...prev, image: e.target.value }))} 
                    style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15 }} 
                  />
                </div>
              </>
            )}
            
            {editContentError && <div style={{ color: '#ff4d4f', marginBottom: 10 }}>{editContentError}</div>}
            {editContentSuccess && <div style={{ color: '#5eead4', marginBottom: 10 }}>{editContentSuccess}</div>}
            
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button 
                onClick={handleContentEditSave} 
                style={{ background: '#5eead4', color: '#181c20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}
              >
                Save
              </button>
              <button 
                onClick={closeContentEdit} 
                style={{ background: '#23272b', color: '#fff', fontWeight: 700, border: '1px solid #5eead4', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 