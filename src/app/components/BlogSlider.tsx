'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
          <div
            key={post._id}
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
            }}
            onClick={() => router.push(`/blog/${post.slug}`)}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{post.title}</div>
            <div style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
            <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>{post.excerpt || (post.content ? post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '') : '')}</div>
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
          </div>
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