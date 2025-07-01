'use client';
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import UserImage from "../../components/UserImage";
import { useParams } from "next/navigation";

interface User {
  name: string;
  image?: string;
  email?: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = decodeURIComponent(params.username as string);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ posts: 0, videos: 0, art: 0 });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const res = await fetch(`/api/users/byname?name=${encodeURIComponent(username)}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.user) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setUser(data.user);
      // Fetch stats
      const [blogRes, videoRes, artRes] = await Promise.all([
        fetch(`/api/blogpost?authorEmail=${data.user.email}`).then(r => r.json()),
        fetch('/api/videos').then(r => r.json()),
        fetch('/api/art').then(r => r.json()),
      ]);
      interface Video { author?: { email?: string } }
      interface Art { author?: { email?: string } }
      const userVideos = (videoRes.videos || []).filter((v: Video) => v.author?.email === data.user.email);
      const userArt = (artRes.art || []).filter((a: Art) => a.author?.email === data.user.email);
      setStats({
        posts: blogRes.posts?.length || 0,
        videos: userVideos.length,
        art: userArt.length,
      });
      setLoading(false);
    }
    fetchUser();
  }, [username]);

  if (loading) {
    return <div style={{ color: '#5eead4', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  }
  if (notFound || !user) {
    return <div style={{ color: '#ff4d4f', textAlign: 'center', marginTop: 80 }}>User not found</div>;
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
      <main style={{ width: '100%', maxWidth: 800, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <UserImage src={user.image || "/profile.png"} alt={user.name} size={120} />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{user.name}</h1>
              <div style={{ color: '#5eead4', fontWeight: 600, fontSize: 16 }}>Community Member</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{stats.posts}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Blog Posts</div>
            </div>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{stats.videos}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Videos</div>
            </div>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{stats.art}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Art Pieces</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 