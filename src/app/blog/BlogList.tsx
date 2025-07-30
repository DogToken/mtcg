'use client';
import React, { useState, useEffect } from "react";
import UserImage from "../components/UserImage";

// Helper function to strip markdown for previews
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^### (.*$)/gim, '$1') // Remove headers
    .replace(/^## (.*$)/gim, '$1')
    .replace(/^# (.*$)/gim, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/^\s*>\s+/gm, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .trim();
};

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
    email?: string;
  };
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [clickedPosts, setClickedPosts] = useState<string[]>([]);
  const [clickingPosts, setClickingPosts] = useState<string[]>([]);

  useEffect(() => {
    // Load clicked posts from localStorage
    const stored = JSON.parse(localStorage.getItem('repClickedPosts') || '[]');
    setClickedPosts(stored);
  }, []);

  const handleRepClick = async (postId: string, authorEmail?: string) => {
    if (clickedPosts.includes(postId) || clickingPosts.includes(postId) || !authorEmail) return;
    
    setClickingPosts(prev => [...prev, postId]);
    
    try {
      const res = await fetch('/api/rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorEmail
        })
      });
      
      if (res.ok) {
        setClickedPosts(prev => [...prev, postId]);
        // Store in localStorage
        const stored = JSON.parse(localStorage.getItem('repClickedPosts') || '[]');
        stored.push(postId);
        localStorage.setItem('repClickedPosts', JSON.stringify(stored));
      }
    } catch (error) {
      console.error('Error clicking REP:', error);
    } finally {
      setClickingPosts(prev => prev.filter(id => id !== postId));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {posts.length === 0 && (
        <div style={{ color: '#b3b8c2', fontSize: 18, textAlign: 'center' }}>No blog posts yet.</div>
      )}
      {posts.map((post) => (
        <button
          key={post._id}
          onClick={() => window.location.href = `/blog/${post.slug}`}
          style={{
            background: 'rgba(34, 38, 44, 0.95)',
            borderRadius: 16,
            padding: 28,
            boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
            transition: 'box-shadow 0.2s',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'inherit'
          }}
        >
          <UserImage src={post.author?.image} alt={post.author?.name || "User"} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 20 }}>{post.title}</span>
              <span style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginLeft: 8 }}>{post.date ? new Date(post.date).toLocaleDateString() : ""}</span>
            </div>
            <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>
              {post.excerpt || (post.content ? stripMarkdown(post.content).slice(0, 120) + (stripMarkdown(post.content).length > 120 ? '...' : '') : '')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{post.author?.name || "User"}</div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRepClick(post._id, post.author?.email);
                }}
                disabled={clickedPosts.includes(post._id) || clickingPosts.includes(post._id)}
                style={{
                  background: clickedPosts.includes(post._id) ? '#5eead4' : '#2a2e33',
                  color: clickedPosts.includes(post._id) ? '#181c20' : '#5eead4',
                  border: '1px solid #5eead4',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontWeight: 600,
                  cursor: clickedPosts.includes(post._id) || clickingPosts.includes(post._id) ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                  transition: 'all 0.2s',
                  opacity: clickedPosts.includes(post._id) || clickingPosts.includes(post._id) ? 0.7 : 1
                }}
              >
                {clickingPosts.includes(post._id) ? '🔄' : clickedPosts.includes(post._id) ? '✅ REP' : '⭐ REP'}
              </button>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
} 