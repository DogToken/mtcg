'use client';
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navItems = ["Home", "Blog", "Videos", "Art", "Info", "Ecosystem"];

export default function Header() {
  const { data: session } = useSession();
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
        <nav style={{ display: 'flex', gap: 24 }}>
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
            <button className="logout-link" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
          ) : (
            <Link href="/login" className="nav-link">Login</Link>
          )}
        </nav>
      </header>
    </>
  );
} 