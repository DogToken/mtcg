import React from "react";
import Header from "./components/Header";
import clientPromise from "../lib/mongodb";
import BlogSlider from "./components/BlogSlider";
import VideoSlider from "./components/VideoSlider";
import ArtSlider from "./components/ArtSlider";
import { Document } from "mongodb";

// Add BlogPost type
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  author?: {
    name?: string;
    image?: string;
  };
}

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

interface Art {
  _id: string;
  url: string;
}

async function getLastBlogPosts(): Promise<BlogPost[]> {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db.collection("posts").find({}).sort({ _id: -1 }).limit(5).toArray();
  return posts.map((post: Document) => ({
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    author: post.author,
  }));
}

async function getLastVideos(): Promise<Video[]> {
  const client = await clientPromise;
  const db = client.db();
  const videos = await db.collection("videos").find({}).sort({ _id: -1 }).limit(5).toArray();
  return videos.map((video: Document) => ({
    _id: video._id.toString(),
    url: video.url,
    description: video.description,
    date: video.date,
    author: video.author,
  }));
}

async function getLastArt(): Promise<Art[]> {
  const client = await clientPromise;
  const db = client.db();
  const art = await db.collection("art").find({}).sort({ _id: -1 }).limit(5).toArray();
  return art.map((a: Document) => ({
    _id: a._id.toString(),
    url: a.url,
  }));
}

export default async function Home() {
  const blogPosts = await getLastBlogPosts();
  const videos = await getLastVideos();
  const art = await getLastArt();
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
          <BlogSlider posts={blogPosts} />
        </section>
        {/* Videos Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Videos</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community video content and highlights!</p>
          <VideoSlider videos={videos} />
        </section>
        {/* Art Section */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Art</h2>
          <p style={{ color: '#b3b8c2', fontSize: 17, marginBottom: 18 }}>Community pictures and art showcase!</p>
          <ArtSlider art={art} />
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
