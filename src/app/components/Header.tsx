'use client';
import React, { useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserImage from "./UserImage";

const navItems = ["Home", "Blog", "Videos", "Art", "Info", "Ecosystem"];

export default function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileImgSrc, setProfileImgSrc] = useState<string | undefined>(session?.user?.image || "/profile.png");

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
        }
        .nav-link:hover {
          color: #fff !important;
        }
        .logo-link, .nav-link-home {
          color: #fff !important;
        }
        .nav-link-home:hover {
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
      }}>
        <Link href="/" className="logo-link" style={{ textDecoration: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em', color: 'inherit' }}>
            Community Group
          </div>
        </Link>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={item === "Home" ? "nav-link nav-link-home" : "nav-link"}
            >
              {item}
            </Link>
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
                  <Link href="/dashboard" style={{ padding: '12px 18px', color: '#fff', textDecoration: 'none', fontWeight: 500, borderRadius: 8, transition: 'background 0.2s' }}>Dashboard</Link>
                  {session.user?.email === "doggo@dogswap.xyz" && (
                    <Link href="/dashboard/admin" style={{ padding: '12px 18px', color: '#fff', textDecoration: 'none', fontWeight: 500, borderRadius: 8, transition: 'background 0.2s' }}>Admin</Link>
                  )}
                  <Link href="/settings" style={{ padding: '12px 18px', color: '#fff', textDecoration: 'none', fontWeight: 500, borderRadius: 8, transition: 'background 0.2s' }}>Settings</Link>
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
    </>
  );
} 