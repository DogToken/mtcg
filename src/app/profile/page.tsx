'use client';
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserImage from "../components/UserImage";

interface Video {
  _id: string;
  author?: { email?: string };
}

interface Art {
  _id: string;
  author?: { email?: string };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState({ posts: 0, videos: 0, art: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      // Fetch user stats
      Promise.all([
        fetch(`/api/blogpost?authorEmail=${session.user.email}`).then(r => r.json()),
        fetch('/api/videos').then(r => r.json()),
        fetch('/api/art').then(r => r.json()),
      ]).then(([blogRes, videoRes, artRes]) => {
        const userVideos = (videoRes.videos || []).filter((v: Video) => v.author?.email === session.user?.email);
        const userArt = (artRes.art || []).filter((a: Art) => a.author?.email === session.user?.email);
        setUserStats({
          posts: blogRes.posts?.length || 0,
          videos: userVideos.length,
          art: userArt.length,
        });
      });
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div style={{ color: '#5eead4', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  }

  if (!session?.user) {
    return <div style={{ color: '#5eead4', textAlign: 'center', marginTop: 80 }}>Not authenticated</div>;
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
            <UserImage src={session.user.image || "/profile.png"} alt={session.user.name || "User"} size={120} />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{session.user.name}</h1>
              <div style={{ color: '#b3b8c2', fontSize: 18, marginBottom: 8 }}>{session.user.email}</div>
              <div style={{ color: '#5eead4', fontWeight: 600, fontSize: 16 }}>
                {session.user.email === "doggo@dogswap.xyz" ? "Super Admin" : "Community Member"}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{userStats.posts}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Blog Posts</div>
            </div>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{userStats.videos}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Videos</div>
            </div>
            <div style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5eead4', marginBottom: 8 }}>{userStats.art}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>Art Pieces</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #2a2e33', paddingTop: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  background: '#5eead4',
                  color: '#181c20',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/settings')}
                style={{
                  background: 'rgba(94,234,212,0.1)',
                  color: '#5eead4',
                  fontWeight: 700,
                  border: '1px solid #5eead4',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Edit Profile
              </button>
              {session.user.email === "doggo@dogswap.xyz" && (
                <button
                  onClick={() => router.push('/dashboard/admin')}
                  style={{
                    background: '#ff4d4f',
                    color: '#fff',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 