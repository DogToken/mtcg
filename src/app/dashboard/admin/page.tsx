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
                  </div>
                  <button onClick={() => handleRemove(user._id)} style={{ marginLeft: 'auto', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
          </>
        )}
        {selectedTab === 'Settings' && (
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
        )}
      </main>
    </div>
  );
} 