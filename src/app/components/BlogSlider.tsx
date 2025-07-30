'use client';
import React, { useState, useRef } from 'react';

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
  };
}

export default function BlogSlider({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (idx: number) => {
    setActive(idx);
    sliderRef.current?.scrollTo({ left: idx * 320, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const idx = Math.round(sliderRef.current.scrollLeft / 320);
    setActive(idx);
  };

  return (
    <div>
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: 24,
          paddingBottom: 8,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {posts.map((post, idx) => (
          <button
            key={post._id}
            onClick={() => window.location.href = `/blog/${post.slug}`}
            style={{
              minWidth: 300,
              maxWidth: 320,
              flex: '0 0 320px',
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              cursor: 'pointer',
              scrollSnapAlign: 'start',
              transition: 'box-shadow 0.2s',
              border: active === idx ? '2px solid #5eead4' : '2px solid transparent',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              fontFamily: 'inherit'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{post.title}</div>
            <div style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
            <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>
              {post.excerpt || (post.content ? stripMarkdown(post.content).slice(0, 100) + (stripMarkdown(post.content).length > 100 ? '...' : '') : '')}
            </div>
            {post.author?.name ? (
              <a
                href={`/profile/${encodeURIComponent(post.author.name)}`}
                style={{ color: '#5eead4', fontWeight: 600, fontSize: 15, textDecoration: 'underline', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); }}
              >
                {post.author.name}
              </a>
            ) : (
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>User</div>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: 'none',
              background: active === idx ? '#5eead4' : '#2a2e33',
              boxShadow: active === idx ? '0 0 8px #00ffff' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
              margin: 0,
              padding: 0,
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 