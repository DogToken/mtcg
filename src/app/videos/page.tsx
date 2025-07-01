import React from "react";
import Header from "../components/Header";
import clientPromise from "../../lib/mongodb";
import { Document } from "mongodb";

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

async function getAllVideos(): Promise<Video[]> {
  const client = await clientPromise;
  const db = client.db();
  const videos = await db.collection("videos").find({}).sort({ _id: -1 }).toArray();
  return videos.map((video: Document) => ({
    _id: video._id.toString(),
    url: video.url,
    description: video.description,
    date: video.date,
    author: video.author,
  }));
}

export default async function VideosPage() {
  const videos = await getAllVideos();
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
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Videos</h2>
          {videos.length === 0 ? (
            <p style={{ color: '#b3b8c2', fontSize: 18 }}>No videos yet. Be the first to post one!</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
            }}>
              {videos.map(video => (
                <div key={video._id} style={{ background: 'rgba(24,28,32,0.98)', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)' }}>
                  {getEmbedUrl(video.url) ? (
                    <iframe
                      width="100%"
                      height="220"
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
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{video.description}</div>
                  <div style={{ color: '#b3b8c2', fontSize: 15 }}>{video.date ? new Date(video.date).toLocaleDateString() : ''}</div>
                  <div style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>{video.author?.name || ''}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 