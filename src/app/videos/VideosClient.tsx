'use client';
import React, { useState, useEffect } from "react";
import Header from "../components/Header";

interface Video {
  _id: string;
  url: string;
  description: string;
  date?: string;
  author?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

function getEmbedUrl(url: string) {
  // Robustly extract the video ID from various YouTube URL formats
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data.videos || []))
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
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
          marginBottom: 32,
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Videos</h2>
          {loading ? (
            <div style={{ color: '#5eead4', textAlign: 'center', fontSize: 18 }}>Loading...</div>
          ) : videos.length === 0 ? (
            <p style={{ color: '#b3b8c2', fontSize: 18 }}>No videos yet. Be the first to post one!</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
            }}>
              {videos.map(video => (
                <div key={video._id} style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {getEmbedUrl(video.url) ? (
                    <iframe
                      width="100%"
                      height="180"
                      src={getEmbedUrl(video.url) as string}
                      title={video.description}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: 10, marginBottom: 12 }}
                    />
                  ) : (
                    <div style={{ color: '#ff4d4f', marginBottom: 8 }}>Invalid YouTube URL</div>
                  )}
                  <div
                    onClick={() => setModalVideo(video)}
                    style={{
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: 16,
                      marginBottom: 6,
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 260,
                      minHeight: 60,
                      maxHeight: 72,
                      width: '100%',
                    }}
                    title={video.description}
                  >
                    {video.description}
                  </div>
                  <button
                    onClick={() => setModalVideo(video)}
                    style={{ background: '#5eead4', color: '#181c20', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 6 }}
                  >
                    ▶ Play
                  </button>
                  <div style={{ color: '#b3b8c2', fontSize: 15 }}>{video.date ? new Date(video.date).toLocaleDateString() : ''}</div>
                  <div style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>{video.author?.name || ''}</div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Modal for playing video */}
        {modalVideo && (
          <div style={{
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
            onClick={() => setModalVideo(null)}
          >
            <div style={{ background: '#23272b', borderRadius: 18, padding: 32, boxShadow: '0 2px 32px 0 rgba(0,255,255,0.10)', maxWidth: 700, width: '90vw', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModalVideo(null)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>&times;</button>
              {getEmbedUrl(modalVideo.url) ? (
                <iframe
                  width="100%"
                  height="400"
                  src={getEmbedUrl(modalVideo.url) as string}
                  title={modalVideo.description}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 12, marginBottom: 18 }}
                />
              ) : (
                <div style={{ color: '#ff4d4f', marginBottom: 8 }}>Invalid YouTube URL</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>{modalVideo.description}</div>
              <div style={{ color: '#b3b8c2', fontSize: 16 }}>{modalVideo.date ? new Date(modalVideo.date).toLocaleDateString() : ''}</div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: 16 }}>{modalVideo.author?.name || ''}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 