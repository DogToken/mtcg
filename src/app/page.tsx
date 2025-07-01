'use client';
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import BlogSlider from "./components/BlogSlider";
import VideoSlider from "./components/VideoSlider";
import ArtSlider from "./components/ArtSlider";

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [art, setArt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [blogRes, videoRes, artRes] = await Promise.all([
        fetch("/api/blogpost").then(r => r.json()),
        fetch("/api/videos").then(r => r.json()),
        fetch("/api/art").then(r => r.json()),
      ]);
      setBlogPosts(blogRes.posts?.slice(0, 5) || []);
      setVideos(videoRes.videos?.slice(0, 5) || []);
      setArt(artRes.art?.slice(0, 5) || []);
      setLoading(false);
    }
    fetchData();
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
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(90deg, #23272b 0%, #181c20 100%)',
          borderRadius: 20,
          padding: 48,
          boxShadow: '0 2px 32px 0 rgba(0,255,255,0.08)',
          marginBottom: 48,
          textAlign: 'center',
          position: 'relative',
        }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: '-0.04em',
            textShadow: '0 0 8px #00ffff, 0 0 16px #ff00cc, 0 0 24px #39ff14',
          }}>
            Welcome to the Community Group
          </h1>
          <p style={{ fontSize: 22, color: '#b3b8c2', marginBottom: 0 }}>
            A modern, dark-themed community portal for sharing, learning, and connecting.
          </p>
        </section>
        {/* Blog Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Blog</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community stories, updates, and more!</p>
          {loading ? <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div> : <BlogSlider posts={blogPosts} />}
        </section>
        {/* Videos Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Videos</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community video content and highlights!</p>
          {loading ? <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div> : <VideoSlider videos={videos} />}
        </section>
        {/* Art Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Art</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community pictures and art showcase!</p>
          {loading ? <div style={{ color: '#5eead4', textAlign: 'center' }}>Loading...</div> : <ArtSlider art={art} />}
        </section>
        {/* Info Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Info</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community information and resources!</p>
          <div style={{ background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
            <ul style={{ color: '#b3b8c2', fontSize: 16, margin: 0, paddingLeft: 20 }}>
              <li>How to join the community</li>
              <li>Community guidelines</li>
              <li>Contact and support</li>
            </ul>
          </div>
        </section>
        {/* Ecosystem Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ecosystem</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Ethers.js integration and community ecosystem features!</p>
          <div style={{ background: 'rgba(34, 38, 44, 0.95)', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)' }}>
            <ul style={{ color: '#b3b8c2', fontSize: 16, margin: 0, paddingLeft: 20 }}>
              <li>Wallet connection</li>
              <li>Token swaps</li>
              <li>Community projects</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
