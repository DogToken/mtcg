'use client';
import React from "react";
import Header from "../components/Header";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img
            src={session?.user?.image || "/public/avatar1.png"}
            alt={session?.user?.name || "User"}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #5eead4',
              boxShadow: '0 0 8px #00ffff',
              marginBottom: 18,
            }}
          />
          <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 6 }}>{session?.user?.name}</div>
          <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 18 }}>{session?.user?.email}</div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: '#5eead4',
              color: '#181c20',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#38bdf8')}
            onMouseOut={e => (e.currentTarget.style.background = '#5eead4')}
          >
            Sign Out
          </button>
        </section>
      </main>
    </div>
  );
} 