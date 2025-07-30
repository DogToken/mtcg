'use client';
import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import UserImage from "./UserImage";

const navItems = ["Home", "Blog", "Videos", "Art", "Ecosystem"];

type SessionUserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

type HeaderProps = {
  editableHeader?: boolean;
};

export default function Header({ editableHeader }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = session?.user as SessionUserWithRole | undefined;
  const [profileImgSrc, setProfileImgSrc] = useState<string | undefined>(session?.user?.image || "/profile.png");

  // State for editable header
  const [headerText, setHeaderText] = useState<string>("Community Group");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Always fetch header info from API on mount
  React.useEffect(() => {
    setLoading(true);
    fetch("/api/admin/siteinfo")
      .then(res => res.json())
      .then(data => {
        setHeaderText(data.info?.header || "Community Group");
        setLogoUrl(data.info?.logo || "");
      })
      .finally(() => setLoading(false));
  }, []);

  // Save header info to API
  const handleSave = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    const res = await fetch("/api/admin/siteinfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ info: { header: headerText, logo: logoUrl } }),
    });
    if (res.ok) setSuccess("Saved!");
    else setError("Failed to save.");
    setLoading(false);
  };

  React.useEffect(() => {
    setProfileImgSrc(session?.user?.image || "/profile.png");
  }, [session?.user?.image]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <>
      <style>{`
        .nav-link {
          color: #b3b8c2;
          text-decoration: none;
          font-weight: 500;
          font-size: 18px;
          transition: color 0.2s;
          cursor: pointer;
          user-select: none;
        }
        .nav-link:hover {
          color: #fff !important;
        }
        .nav-link:active {
          color: #fff !important;
        }
        .logo-link, .nav-link-home {
          color: #fff !important;
          cursor: pointer;
          user-select: none;
        }
        .nav-link-home:hover {
          color: #fff !important;
        }
        .nav-link-home:active {
          color: #fff !important;
        }
        .logout-link {
          color: #ff4d4f !important;
          background: none;
          border: none;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }
        .logout-link:hover {
          color: #fff !important;
        }
      `}</style>
      <header style={{
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #2a2e33',
        padding: '0 32px 16px 32px',
        marginBottom: 32,
        position: 'relative',
      }}>
        <Link href="/" className="logo-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', border: '1px solid #5eead4' }} />}
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em', color: 'inherit' }}>
            {headerText}
          </div>
        </Link>
        {editableHeader && user?.role === 'admin' && (
          <button
            onClick={() => setShowEditModal(true)}
            style={{ position: 'absolute', right: 32, top: 0, background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, cursor: 'pointer', zIndex: 10 }}
          >
            Edit Header
          </button>
        )}
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
              className={item === "Home" ? "nav-link nav-link-home" : "nav-link"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {item}
            </button>
          ))}
          {session ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: '50%',
                  outline: 'none',
                }}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="User menu"
              >
                <UserImage src={profileImgSrc} alt={session.user?.name || "User"} size={40} />
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  background: '#23272b',
                  borderRadius: 12,
                  boxShadow: '0 2px 16px 0 rgba(0,255,255,0.10)',
                  minWidth: 180,
                  zIndex: 100,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}>
                  <button
                    onClick={() => {
                      router.push('/dashboard');
                      setTimeout(() => setDropdownOpen(false), 100);
                    }}
                    style={{ 
                      padding: '12px 18px', 
                      color: '#fff', 
                      textDecoration: 'none', 
                      fontWeight: 500, 
                      fontSize: 18,
                      borderRadius: 8, 
                      transition: 'background 0.2s',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setTimeout(() => setDropdownOpen(false), 100);
                    }}
                    style={{ 
                      padding: '12px 18px', 
                      color: '#fff', 
                      textDecoration: 'none', 
                      fontWeight: 500, 
                      fontSize: 18,
                      borderRadius: 8, 
                      transition: 'background 0.2s',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    Profile
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        router.push('/dashboard/admin');
                        setTimeout(() => setDropdownOpen(false), 100);
                      }}
                      style={{ 
                        padding: '12px 18px', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        fontWeight: 500, 
                        fontSize: 18,
                        borderRadius: 8, 
                        transition: 'background 0.2s',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                      }}
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    style={{
                      padding: '12px 18px',
                      color: '#ff4d4f',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 500,
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-link">Login</Link>
          )}
        </nav>
      </header>
      {editableHeader && user?.role === 'admin' && showEditModal && (
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
        }} onClick={() => setShowEditModal(false)}>
          <div style={{ background: '#23272b', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 24px #00ffff', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Edit Header</h3>
            <input type="text" value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="Header Text" style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, marginBottom: 14 }} />
            <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Logo URL (e.g. /profile.png)" style={{ width: '100%', borderRadius: 8, border: '1px solid #2a2e33', background: '#181c20', color: '#fff', padding: 8, fontSize: 15, marginBottom: 14 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              {logoUrl && <img src={logoUrl} alt="Logo preview" style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid #5eead4', background: '#fff' }} />}
              <span style={{ color: '#fff', fontWeight: 600 }}>{headerText}</span>
            </div>
            <button onClick={handleSave} disabled={loading} style={{ background: '#5eead4', color: '#181c20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', marginRight: 12 }}>Save</button>
            <button onClick={() => setShowEditModal(false)} style={{ background: '#23272b', color: '#fff', fontWeight: 700, border: '1px solid #5eead4', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            {loading && <span style={{ color: '#5eead4', marginLeft: 10 }}>Saving...</span>}
            {success && <span style={{ color: '#5eead4', marginLeft: 10 }}>{success}</span>}
            {error && <span style={{ color: '#ff4d4f', marginLeft: 10 }}>{error}</span>}
          </div>
        </div>
      )}
    </>
  );
} 