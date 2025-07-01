'use client';
import React, { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import BlogSlider from "./components/BlogSlider";
import VideoSlider from "./components/VideoSlider";
import ArtSlider from "./components/ArtSlider";

function HeroSlider() {
  const [slides, setSlides] = useState<{ image: string; alt: string; text: string }[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/admin/hero').then(res => res.json()).then(data => {
      setSlides(Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : [
        { image: '/public/globe.svg', alt: 'Community', text: `<h1 style='font-size:40px;font-weight:800;margin-bottom:16px;letter-spacing:-0.04em;text-shadow:0 0 8px #00ffff,0 0 16px #ff00cc,0 0 24px #39ff14'>Welcome to the Community Group</h1><p style='font-size:22px;color:#b3b8c2;margin-bottom:0'>A modern, dark-themed community portal for sharing, learning, and connecting.</p>` }
      ]);
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [slides]);

  if (!slides.length) return null;
  const slide = slides[current];
  return (
    <section style={{
      background: 'linear-gradient(90deg, #23272b 0%, #181c20 100%)',
      borderRadius: 20,
      padding: 0,
      boxShadow: '0 2px 32px 0 rgba(0,255,255,0.08)',
      marginBottom: 48,
      textAlign: 'center',
      position: 'relative',
      minHeight: 260,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
    }}>
      <img src={slide.image} alt={slide.alt} style={{
        width: '100%',
        height: 320,
        objectFit: 'cover',
        opacity: 0.25,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        padding: 48,
      }}>
        <div dangerouslySetInnerHTML={{ __html: slide.text }} />
      </div>
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 3 }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i === current ? '#5eead4' : '#23272b', border: '2px solid #5eead4', transition: 'background 0.2s' }} />
          ))}
        </div>
      )}
    </section>
  );
}

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
        <HeroSlider />
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
