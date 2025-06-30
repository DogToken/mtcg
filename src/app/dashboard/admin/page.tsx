'use client';
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockReg, setBlockReg] = useState(false);

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
    }
  }, [status, session, router]);

  const handleRemove = async (id: string) => {
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u._id !== id));
  };

  const handleToggleBlock = async () => {
    await fetch('/api/admin/blockreg', { method: 'POST', body: JSON.stringify({ blocked: !blockReg }), headers: { 'Content-Type': 'application/json' } });
    setBlockReg(!blockReg);
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
              <Image
                src={user.image || "/avatar1.png"}
                alt={user.name}
                width={48}
                height={48}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #5eead4',
                  boxShadow: '0 0 8px #00ffff',
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</div>
                <div style={{ color: '#b3b8c2', fontSize: 15 }}>{user.email}</div>
              </div>
              <button onClick={() => handleRemove(user._id)} style={{ marginLeft: 'auto', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 