'use client';
import React, { useState, useRef } from 'react';

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

export default function VideoSlider({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (idx: number) => {
    setActive(idx);
    sliderRef.current?.scrollTo({ left: idx * 340, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const idx = Math.round(sliderRef.current.scrollLeft / 340);
    setActive(idx);
  };

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    // Robustly extract the video ID from various YouTube URL formats
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([A-Za-z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
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
        {videos.map((video, idx) => (
          <div
            key={video._id}
            style={{
              minWidth: 320,
              maxWidth: 340,
              flex: '0 0 340px',
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              scrollSnapAlign: 'start',
              border: active === idx ? '2px solid #5eead4' : '2px solid transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '280px',
              justifyContent: 'space-between',
            }}
          >
            {getEmbedUrl(video.url) ? (
              <iframe
                width="280"
                height="158"
                src={getEmbedUrl(video.url) as string}
                title={video.description}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 10, marginBottom: 8 }}
              />
            ) : (
              <div style={{ color: '#ff4d4f', marginBottom: 8 }}>Invalid YouTube URL</div>
            )}
            <div style={{ 
              fontWeight: 700, 
              fontSize: 16, 
              marginBottom: 6,
              maxHeight: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.2',
              wordBreak: 'break-word'
            }}>
              {video.description}
            </div>
            <div style={{ color: '#b3b8c2', fontSize: 14 }}>{video.date ? new Date(video.date).toLocaleDateString() : ''}</div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>{video.author?.name || ''}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
        {videos.map((_, idx) => (
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