"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";

interface Art {
  _id: string;
  url: string;
  author?: { name?: string; image?: string };
  date?: string;
}

export default function ArtClient() {
  const [art, setArt] = useState<Art[]>([]);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/art")
      .then(res => res.json())
      .then(data => setArt(data.art || []))
      .finally(() => setLoading(false));
  }, []);

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
      <main style={{ width: '100%', maxWidth: 1100, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
          marginBottom: 32,
          maxWidth: 1000,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Art Gallery</h2>
          {loading ? (
            <div style={{ color: '#5eead4', textAlign: 'center', margin: 40 }}>Loading...</div>
          ) : art.length === 0 ? (
            <div style={{ color: '#b3b8c2', fontSize: 18, textAlign: 'center' }}>No art yet. Be the first to post!</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 32,
              marginTop: 24,
            }}>
              {art.map((a: Art) => (
                <div key={a._id} style={{
                  background: 'rgba(24,28,32,0.98)',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)',
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  border: '2px solid transparent',
                  minHeight: 260,
                }}
                  onClick={() => setModalImg(a.url)}
                  onMouseOver={e => (e.currentTarget.style.boxShadow = '0 0 24px #5eead4, 0 2px 8px 0 rgba(0,255,255,0.10)')}
                  onMouseOut={e => (e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0,255,255,0.04)')}
                >
                  <img
                    src={a.url}
                    alt="Art"
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, border: '2px solid #5eead4', boxShadow: '0 0 8px #00ffff', background: '#23272b', transition: 'transform 0.2s' }}
                    onError={e => (e.currentTarget.src = '/profile.png')}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {modalImg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="Art Large"
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              borderRadius: 16,
              border: '3px solid #5eead4',
              boxShadow: '0 0 32px #00ffff',
              background: '#23272b',
            }}
            onClick={e => e.stopPropagation()}
            onError={e => (e.currentTarget.src = '/profile.png')}
          />
        </div>
      )}
    </div>
  );
} 