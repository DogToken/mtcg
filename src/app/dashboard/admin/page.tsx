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
  const [selectedTab, setSelectedTab] = useState<'Users' | 'Settings'>('Users');
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email !== "doggo@dogswap.xyz") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetch("/api/admin/users").then(res => res.json()).then(data => {
        setUsers(data.users || []);
        setLoading(false);
      });
      fetch("/api/admin/blockreg").then(res => res.json()).then(data => {
        setBlockReg(data.blocked || false);
      });
      if (selectedTab === 'Settings') {
        fetchFooter();
        fetchEcoWelcome();
        fetchEcoEngagement();
        fetchEcoResources();
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
      <Header />
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 18, marginBottom: 32 }}>
          <button onClick={() => setSelectedTab('Users')} style={{ color: selectedTab === 'Users' ? '#fff' : '#5eead4', background: selectedTab === 'Users' ? 'rgba(94,234,212,0.08)' : 'none', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>Users</button>
          <button onClick={() => setSelectedTab('Settings')} style={{ color: selectedTab === 'Settings' ? '#fff' : '#5eead4', background: selectedTab === 'Settings' ? 'rgba(94,234,212,0.08)' : 'none', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}>Settings</button>
        </div>
        {selectedTab === 'Users' && (
          <>
            <button onClick={handleToggleBlock} style={{ marginBottom: 24, padding: '8px 18px', borderRadius: 8, background: blockReg ? '#ff4d4f' : '#5eead4', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>{blockReg ? 'Unblock Registrations' : 'Block Registrations'}</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {users.map((user) => (
                <div key={user._id} style={{
                  background: 'rgba(34, 38, 44, 0.95)',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}>
                  <UserImage src={user.image} alt={user.name} size={48} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</div>
                    <div style={{ color: '#b3b8c2', fontSize: 15 }}>{user.email}</div>
                    <div style={{ color: user.role === 'admin' ? '#ff4d4f' : '#5eead4', fontWeight: 600, fontSize: 15 }}>{user.role === 'admin' ? 'Admin' : 'User'}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                    <button onClick={() => openEdit(user)} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                    <button
                      onClick={() => handleRemove(user._id)}
                      style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: user.role === 'admin' || user.email === session?.user?.email ? 'not-allowed' : 'pointer', opacity: user.role === 'admin' || user.email === session?.user?.email ? 0.5 : 1 }}
                      disabled={user.role === 'admin' || user.email === session?.user?.email}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {selectedTab === 'Settings' && (
          <>
            <section style={{ background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)', maxWidth: 600, margin: '0 auto' }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Footer Settings</h3>
              {footerLoading && <div style={{ color: '#5eead4', marginBottom: 12 }}>Loading...</div>}
              {footerError && <div style={{ color: '#ff4d4f', marginBottom: 12 }}>{footerError}</div>}
              {footerSuccess && <div style={{ color: '#5eead4', marginBottom: 12 }}>{footerSuccess}</div>}
              {footerContent && (
                <form onSubmit={e => { e.preventDefault(); handleFooterSave(); }}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16 }}>About</label>
                    <textarea value={footerContent.about} onChange={e => handleFooterChange('about', e.target.value)} style={{ width: '100%', minHeight: 60, marginTop: 6, borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 10, fontSize: 15 }} />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16 }}>Quick Links</label>
                    {footerContent.links.map((link, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <input value={link.label} onChange={e => handleFooterLinkChange(idx, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                        <input value={link.href} onChange={e => handleFooterLinkChange(idx, 'href', e.target.value)} placeholder="URL" style={{ flex: 2, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 600, fontSize: 16 }}>Socials</label>
                    {footerContent.socials.map((social, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <input value={social.label} onChange={e => handleFooterSocialChange(idx, 'label', e.target.value)} placeholder="Label" style={{ flex: 1, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                        <input value={social.href} onChange={e => handleFooterSocialChange(idx, 'href', e.target.value)} placeholder="URL" style={{ flex: 2, borderRadius: 6, border: '1px solid #2a2e33', background: '#23272b', color: '#fff', padding: 6, fontSize: 15 }} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" style={{ background: '#5eead4', color: '#181c20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 17, cursor: 'pointer', marginTop: 8 }}>Save</button>
                </form>
              )}
            </section>
            <div style={{ marginTop: 40, background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Ecosystem Welcome Section</div>
              <textarea
                value={ecoWelcome}
                onChange={e => setEcoWelcome(e.target.value)}
                rows={4}
                style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                placeholder="Welcome message for the top of the ecosystem page..."
              />
              <button onClick={handleEcoWelcomeSave} disabled={ecoWelcomeLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>Save</button>
              {ecoWelcomeLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
              {ecoWelcomeSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoWelcomeSuccess}</span>}
              {ecoWelcomeError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoWelcomeError}</span>}
            </div>
            <div style={{ marginTop: 32, background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Ecosystem Engagement Section</div>
              <textarea
                value={ecoEngagement}
                onChange={e => setEcoEngagement(e.target.value)}
                rows={4}
                style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                placeholder="Engagement opportunities to show above profiles..."
              />
              <button onClick={handleEcoEngagementSave} disabled={ecoEngagementLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>Save</button>
              {ecoEngagementLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
              {ecoEngagementSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoEngagementSuccess}</span>}
              {ecoEngagementError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoEngagementError}</span>}
            </div>
            <div style={{ marginTop: 32, background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Ecosystem Resource Hub Section</div>
              <textarea
                value={ecoResources}
                onChange={e => setEcoResources(e.target.value)}
                rows={4}
                style={{ width: '100%', fontSize: 16, borderRadius: 8, border: '1px solid #5eead4', padding: 12, marginBottom: 10, background: '#181c20', color: '#fff' }}
                placeholder="Resource hub content to show below profiles..."
              />
              <button onClick={handleEcoResourcesSave} disabled={ecoResourcesLoading} style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}>Save</button>
              {ecoResourcesLoading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
              {ecoResourcesSuccess && <span style={{ color: '#5eead4', marginLeft: 10 }}>{ecoResourcesSuccess}</span>}
              {ecoResourcesError && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{ecoResourcesError}</span>}
            </div>
          </>
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
    </div>
  );
} 