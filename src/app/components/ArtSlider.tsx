'use client';
import React, { useState, useRef } from 'react';

interface ArtItem {
  id: number;
  title: string;
  image: string;
}

export default function ArtSlider({ art }: { art: ArtItem[] }) {
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
        {art.map((item, idx) => (
          <div
            key={item.id}
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
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{item.title}</div>
            <img
              src={item.image}
              alt={item.title}
              width={280}
              height={180}
              style={{ borderRadius: 10, marginBottom: 8, objectFit: 'cover', width: 280, height: 180 }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
        {art.map((_, idx) => (
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